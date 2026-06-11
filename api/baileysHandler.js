/**
 * baileysHandler.js — Motor Financeiro x Baileys
 *
 * Como usar no seu bot principal:
 *
 *   import { financeHandler } from './baileysHandler.js'
 *
 *   sock.ev.on('messages.upsert', (event) => financeHandler(sock, event))
 *
 * O handler intercepta TODOS os '!fin' antes do código de SDR/leads.
 * Se a mensagem for um comando financeiro, responde e faz `return`
 * (sai da função inteira), impedindo que caia nas suas regras de
 * qualificação de leads.
 */

// URL da API — configure FINANCE_API_URL no .env do seu bot se diferente
const FINANCE_API = process.env.FINANCE_API_URL ?? 'http://localhost:3001'

/**
 * Extrai o texto de qualquer formato que o Baileys entregue.
 * Cobre: texto puro, reply, legenda de imagem/vídeo.
 */
function extractText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ''
  ).trim()
}

/**
 * Handler principal — plugue direto no sock.ev.on('messages.upsert', ...)
 *
 * @param {object} sock       - instância do socket Baileys
 * @param {object} event      - { messages, type } do evento upsert
 */
export async function financeHandler(sock, { messages, type }) {
  // Baileys pode disparar 'append' para histórico; só queremos novas mensagens
  if (type !== 'notify') return

  for (const msg of messages) {
    // Ignora mensagens sem conteúdo ou enviadas pelo próprio bot
    if (!msg.message || msg.key.fromMe) continue

    const remoteJid   = msg.key.remoteJid
    const textMessage = extractText(msg)

    if (!textMessage) continue

    // ──────────────────────────────────────────────────────────────
    // Interceptação do Motor Financeiro
    // ──────────────────────────────────────────────────────────────
    try {
      const res = await fetch(`${FINANCE_API}/api/webhook/finance`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ remoteJid, textMessage }),
      })

      if (!res.ok) throw new Error(`API respondeu HTTP ${res.status}`)

      const json = await res.json()

      // A API retornou um reply → mensagem financeira confirmada.
      // Responde no WhatsApp e interrompe o handler para que a
      // mensagem NÃO chegue ao fluxo de SDR/leads.
      if (!json.ignored && json.reply) {
        await sock.sendMessage(remoteJid, { text: json.reply }, { quoted: msg })
        return // ← sai de financeHandler; SDR não é executado
      }

    } catch (err) {
      // Erro de rede ou API offline — falha silenciosa para não
      // derrubar o bot principal. Mensagem continua para o SDR.
      console.error('[financeHandler] erro ao contactar API:', err.message)
    }

    // ──────────────────────────────────────────────────────────────
    // Mensagem não era financeira (ou API falhou).
    // Cole aqui o seu código de SDR / qualificação de leads:
    //
    //   await handleLeadMessage(sock, msg, textMessage)
    //
    // ──────────────────────────────────────────────────────────────
  }
}
