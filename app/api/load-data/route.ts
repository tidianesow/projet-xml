import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Dans un vrai projet, vous chargeriez depuis un fichier XML
    // Pour cette démo, nous retournons des données d'exemple
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<whatsapp_platform>
  <users>
    <user id="user1">
      <name>Tidiane Sow</name>
      <email>tidiane@example.com</email>
      <status>online</status>
    </user>
  </users>
  <contacts>
    <contact id="contact1">
      <userId>user2</userId>
      <name>Ibrahima Fall</name>
      <status>online</status>
      <lastMessage>Salut, comment ça va ?</lastMessage>
      <lastMessageTime>14:30</lastMessageTime>
      <unreadCount>2</unreadCount>
    </contact>
  </contacts>
  <groups>
    <group id="group1">
      <name>Projet DSS-XML</name>
      <description>Groupe de travail pour le projet</description>
      <admin>user1</admin>
      <members>
        <member>user1</member>
        <member>user2</member>
        <member>user3</member>
      </members>
      <lastMessage>Réunion demain à 14h</lastMessage>
      <lastMessageTime>16:45</lastMessageTime>
      <unreadCount>1</unreadCount>
    </group>
  </groups>
  <messages>
    <message id="msg1">
      <senderId>user2</senderId>
      <receiverId>user1</receiverId>
      <content>Salut, comment ça va ?</content>
      <type>text</type>
      <timestamp>2025-01-12T14:30:00Z</timestamp>
      <status>read</status>
    </message>
  </messages>
</whatsapp_platform>`

    return NextResponse.json({
      success: true,
      xml: sampleXML,
      message: "Données XML chargées avec succès",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors du chargement" }, { status: 500 })
  }
}
