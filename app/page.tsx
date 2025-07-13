"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Users,
  Settings,
  Plus,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Bell,
  Archive,
  Star,
  Hash,
  Calendar,
  FileText,
  Smile,
  Bold,
  Italic,
  Link,
  Code,
  List,
  Quote,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: string
}

interface Contact {
  id: string
  userId: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

interface Group {
  id: string
  name: string
  description?: string
  avatar?: string
  members: string[]
  admin: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

interface Message {
  id: string
  senderId: string
  receiverId?: string
  groupId?: string
  content: string
  type: "text" | "file" | "image"
  timestamp: string
  status: "sent" | "delivered" | "read"
}

export default function ProfessionalChatPlatform() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "user1",
    name: "Tidiane Sow",
    email: "tidiane@example.com",
    status: "online",
  })

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "contact1",
      userId: "user2",
      name: "Ibrahima Fall",
      status: "online",
      lastMessage: "Salut, comment ça va ?",
      lastMessageTime: "14:30",
      unreadCount: 2,
    },
    {
      id: "contact2",
      userId: "user3",
      name: "Fatou Diop",
      status: "offline",
      lastMessage: "À bientôt !",
      lastMessageTime: "12:15",
      unreadCount: 0,
    },
  ])

  const [groups, setGroups] = useState<Group[]>([
    {
      id: "group1",
      name: "Projet DSS-XML",
      description: "Groupe de travail pour le projet",
      members: ["user1", "user2", "user3", "user4"],
      admin: "user1",
      lastMessage: "Réunion demain à 14h",
      lastMessageTime: "16:45",
      unreadCount: 1,
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "user2",
      receiverId: "user1",
      content: "Salut, comment ça va ?",
      type: "text",
      timestamp: "2025-01-12T14:30:00Z",
      status: "read",
    },
    {
      id: "msg2",
      senderId: "user1",
      receiverId: "user2",
      content: "Ça va bien, merci ! Et toi ?",
      type: "text",
      timestamp: "2025-01-12T14:32:00Z",
      status: "delivered",
    },
  ])

  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [activeChatType, setActiveChatType] = useState<"contact" | "group">("contact")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Dialogs state
  const [showAddContact, setShowAddContact] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Form states
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  // Mettre à jour les appels API pour utiliser les endpoints PHP
  const saveDataToXML = async () => {
    const data = {
      users: [currentUser],
      contacts,
      groups,
      messages,
    }

    try {
      await fetch("/api/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  // Ajouter une fonction pour charger les données depuis PHP
  const loadDataFromXML = async () => {
    try {
      const response = await fetch("/api/load-data")
      if (!response.ok) throw new Error("HTTP error " + response.status)

      // make sure we really got JSON
      const contentType = response.headers.get("content-type") ?? ""
      if (!contentType.includes("application/json")) {
        throw new Error("Réponse inattendue (pas du JSON)")
      }

      const result = await response.json()

      if (result.success && result.data) {
        setContacts(result.data.contacts ?? [])
        setGroups(result.data.groups ?? [])
        setMessages(result.data.messages ?? [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    }
  }

  // Appeler loadDataFromXML au démarrage du composant
  useEffect(() => {
    loadDataFromXML()
  }, [])

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      [activeChatType === "contact" ? "receiverId" : "groupId"]: activeChat,
      content: newMessage,
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Update last message in contacts/groups
    if (activeChatType === "contact") {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === activeChat
            ? {
                ...contact,
                lastMessage: newMessage,
                lastMessageTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
              }
            : contact,
        ),
      )
    } else {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === activeChat
            ? {
                ...group,
                lastMessage: newMessage,
                lastMessageTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
              }
            : group,
        ),
      )
    }

    // Save to XML
    await saveDataToXML()
  }

  const addContact = () => {
    if (!newContactName.trim() || !newContactEmail.trim()) return

    const newContact: Contact = {
      id: `contact${Date.now()}`,
      userId: `user${Date.now()}`,
      name: newContactName,
      status: "offline",
      unreadCount: 0,
    }

    setContacts((prev) => [...prev, newContact])
    setNewContactName("")
    setNewContactEmail("")
    setShowAddContact(false)
    saveDataToXML()
  }

  const createGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: Group = {
      id: `group${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      members: [currentUser.id, ...selectedMembers],
      admin: currentUser.id,
      unreadCount: 0,
    }

    setGroups((prev) => [...prev, newGroup])
    setNewGroupName("")
    setNewGroupDescription("")
    setSelectedMembers([])
    setShowCreateGroup(false)
    saveDataToXML()
  }

  const getChatMessages = () => {
    return messages.filter((msg) => {
      if (activeChatType === "contact") {
        return (
          (msg.senderId === currentUser.id && msg.receiverId === activeChat) ||
          (msg.senderId === activeChat && msg.receiverId === currentUser.id)
        )
      } else {
        return msg.groupId === activeChat
      }
    })
  }

  const getActiveChatName = () => {
    if (activeChatType === "contact") {
      const contact = contacts.find((c) => c.id === activeChat)
      return contact?.name || ""
    } else {
      const group = groups.find((g) => g.id === activeChat)
      return group?.name || ""
    }
  }

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Dark Theme */}
      <div className="w-80 bg-gray-900 text-white flex flex-col">
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-600 text-white">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold text-white">{currentUser.name}</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">En ligne</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <MessageCircle className="h-4 w-4 mr-3" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <Users className="h-4 w-4 mr-3" />
            Équipes
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <Phone className="h-4 w-4 mr-3" />
            Appels
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <Calendar className="h-4 w-4 mr-3" />
            Calendrier
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
            <FileText className="h-4 w-4 mr-3" />
            Fichiers
          </Button>
        </div>

        <Separator className="bg-gray-700" />

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat === contact.id && activeChatType === "contact" ? "bg-blue-600" : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  setActiveChat(contact.id)
                  setActiveChatType("contact")
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-600 text-white text-sm">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                        contact.status === "online" ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white truncate">{contact.name}</h3>
                      <span className="text-xs text-gray-400">{contact.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{contact.unreadCount}</Badge>
                  )}
                </div>
              </div>
            ))}

            {/* Groups */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">GROUPES</h4>
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat === group.id && activeChatType === "group" ? "bg-blue-600" : "hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setActiveChat(group.id)
                    setActiveChatType("group")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-600 text-white">
                        <Hash className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">{group.name}</h3>
                        <span className="text-xs text-gray-400">{group.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{group.lastMessage}</p>
                    </div>
                    {group.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">{group.unreadCount}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Add Contact/Group Buttons */}
        <div className="p-4 space-y-2">
          <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Nom</Label>
                  <Input
                    id="contact-name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Nom du contact"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <Button onClick={addContact} className="w-full">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Hash className="h-4 w-4 mr-2" />
                Créer un groupe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau groupe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Nom du groupe</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nom du groupe"
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Description du groupe (optionnel)"
                  />
                </div>
                <Button onClick={createGroup} className="w-full">
                  Créer le groupe
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    {activeChatType === "group" ? (
                      <Hash className="h-4 w-4" />
                    ) : (
                      getActiveChatName()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{getActiveChatName()}</h2>
                  <p className="text-sm text-gray-600">
                    {activeChatType === "group"
                      ? `${groups.find((g) => g.id === activeChat)?.members.length} membres`
                      : "En ligne"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4 max-w-4xl mx-auto">
                {getChatMessages().map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex gap-3 max-w-lg">
                      {message.senderId !== currentUser.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-400 text-white text-sm">
                            {contacts.find((c) => c.userId === message.senderId)?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.senderId === currentUser.id ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                        }`}
                      >
                        {activeChatType === "group" && message.senderId !== currentUser.id && (
                          <p className="text-xs font-semibold mb-1 opacity-70">
                            {contacts.find((c) => c.userId === message.senderId)?.name || "Utilisateur"}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === currentUser.id ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="max-w-4xl mx-auto">
                {/* Formatting Toolbar */}
                <div className="flex gap-1 mb-2 pb-2 border-b">
                  <Button variant="ghost" size="sm">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Quote className="h-4 w-4" />
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Envoyer un message à ${getActiveChatName()}...`}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Plateforme de Discussion Professionnelle</h2>
              <p className="text-gray-500">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Profile Panel */}
      {activeChat && (
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-6 border-b">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {activeChatType === "group" ? (
                    <Hash className="h-8 w-8" />
                  ) : (
                    getActiveChatName()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{getActiveChatName()}</h3>
              <p className="text-sm text-gray-600">
                {activeChatType === "group" ? "Groupe de discussion" : "Contact professionnel"}
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Vidéo
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Informations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>contact@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="text-green-600">En ligne</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuseau horaire:</span>
                    <span>GMT+0</span>
                  </div>
                </div>
              </div>

              {activeChatType === "group" && (
                <div>
                  <h4 className="font-medium mb-2">Membres du groupe</h4>
                  <div className="space-y-2">
                    {groups
                      .find((g) => g.id === activeChat)
                      ?.members.map((memberId) => (
                        <div key={memberId} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-400 text-white text-xs">
                              {contacts.find((c) => c.userId === memberId)?.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {contacts.find((c) => c.userId === memberId)?.name || "Utilisateur"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Fichiers partagés</h4>
                <p className="text-sm text-gray-500">Aucun fichier partagé</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Paramètres</h4>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-red-600">
                    <Users className="h-4 w-4 mr-2" />
                    Quitter le groupe
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
