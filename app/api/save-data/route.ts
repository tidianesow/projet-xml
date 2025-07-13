import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Génération du XML avec les données
    const xmlData = generateXML(data)

    // Dans un vrai projet, vous sauvegarderiez dans un fichier
    // Pour cette démo, nous retournons juste une confirmation
    console.log("Données XML générées:", xmlData)

    return NextResponse.json({
      success: true,
      message: "Données sauvegardées en XML",
      xml: xmlData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de la sauvegarde" }, { status: 500 })
  }
}

function generateXML(data: any): string {
  const { users, contacts, groups, messages } = data

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += "<whatsapp_platform>\n"

  // Users
  xml += "  <users>\n"
  users.forEach((user: any) => {
    xml += `    <user id="${user.id}">\n`
    xml += `      <name>${escapeXml(user.name)}</name>\n`
    xml += `      <email>${escapeXml(user.email)}</email>\n`
    xml += `      <status>${user.status}</status>\n`
    if (user.avatar) xml += `      <avatar>${escapeXml(user.avatar)}</avatar>\n`
    if (user.lastSeen) xml += `      <lastSeen>${user.lastSeen}</lastSeen>\n`
    xml += "    </user>\n"
  })
  xml += "  </users>\n"

  // Contacts
  xml += "  <contacts>\n"
  contacts.forEach((contact: any) => {
    xml += `    <contact id="${contact.id}">\n`
    xml += `      <userId>${contact.userId}</userId>\n`
    xml += `      <name>${escapeXml(contact.name)}</name>\n`
    xml += `      <status>${contact.status}</status>\n`
    if (contact.avatar) xml += `      <avatar>${escapeXml(contact.avatar)}</avatar>\n`
    if (contact.lastMessage) xml += `      <lastMessage>${escapeXml(contact.lastMessage)}</lastMessage>\n`
    if (contact.lastMessageTime) xml += `      <lastMessageTime>${contact.lastMessageTime}</lastMessageTime>\n`
    xml += `      <unreadCount>${contact.unreadCount}</unreadCount>\n`
    xml += "    </contact>\n"
  })
  xml += "  </contacts>\n"

  // Groups
  xml += "  <groups>\n"
  groups.forEach((group: any) => {
    xml += `    <group id="${group.id}">\n`
    xml += `      <name>${escapeXml(group.name)}</name>\n`
    if (group.description) xml += `      <description>${escapeXml(group.description)}</description>\n`
    if (group.avatar) xml += `      <avatar>${escapeXml(group.avatar)}</avatar>\n`
    xml += `      <admin>${group.admin}</admin>\n`
    xml += "      <members>\n"
    group.members.forEach((memberId: string) => {
      xml += `        <member>${memberId}</member>\n`
    })
    xml += "      </members>\n"
    if (group.lastMessage) xml += `      <lastMessage>${escapeXml(group.lastMessage)}</lastMessage>\n`
    if (group.lastMessageTime) xml += `      <lastMessageTime>${group.lastMessageTime}</lastMessageTime>\n`
    xml += `      <unreadCount>${group.unreadCount}</unreadCount>\n`
    xml += "    </group>\n"
  })
  xml += "  </groups>\n"

  // Messages
  xml += "  <messages>\n"
  messages.forEach((message: any) => {
    xml += `    <message id="${message.id}">\n`
    xml += `      <senderId>${message.senderId}</senderId>\n`
    if (message.receiverId) xml += `      <receiverId>${message.receiverId}</receiverId>\n`
    if (message.groupId) xml += `      <groupId>${message.groupId}</groupId>\n`
    xml += `      <content>${escapeXml(message.content)}</content>\n`
    xml += `      <type>${message.type}</type>\n`
    xml += `      <timestamp>${message.timestamp}</timestamp>\n`
    xml += `      <status>${message.status}</status>\n`
    xml += "    </message>\n"
  })
  xml += "  </messages>\n"

  xml += "</whatsapp_platform>"

  return xml
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}
