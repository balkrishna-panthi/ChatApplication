using ChatAPI.Models;
using ChatAPI.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace ChatAPI.Hubs
{
    public class ChatHub:Hub
    {
        private readonly ChatService chatService;
        public ChatHub(ChatService chatService)
        {
            this.chatService = chatService;       
        }
        public override async Task OnConnectedAsync()
        {
            await (Groups.AddToGroupAsync(Context.ConnectionId, "Come2Chat"));
            await Clients.Caller.SendAsync("UserConnected");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Come2Chat");
            var user = chatService.GetUserByConnectionId(Context.ConnectionId);
            chatService.RemoveUserFromList(user);

            await DisplayOnlineusers();
            await base.OnDisconnectedAsync(exception);
        }
        public async Task AddUserConnectionId(string name)
        {
            chatService.AddUserConnectionId(name , Context.ConnectionId);
            await DisplayOnlineusers();
        }

        public async Task ReceiveMessage(Messages message)
        {
            await Clients.Group("Come2Chat").SendAsync("NewMessage",message);
        }

        public async Task CreatePrivateChat(Messages message)
        {
            string privateGroupName = GetPrivateGroupName(message.From , message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId , privateGroupName);
            var toConnectionId = chatService.GetConnectionIdByUser(message.To);

            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
            await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
        }

        public async Task ReceivePrivateMessage(Messages message)
        {
            string privateGroupName = GetPrivateGroupName(message.From , message.To);
            await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message);
        }
        public async Task RemovePrivateChat(string from , string to)
        {
            string privateGroupName = GetPrivateGroupName(from, to);
            await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId , privateGroupName);
            var toConnectionId = chatService.GetConnectionIdByUser (to);
            await Groups.RemoveFromGroupAsync (toConnectionId , privateGroupName);
        }
        private async Task DisplayOnlineusers()
        {
            var onlineUsers = chatService.GetOnlineUsers();
            await Clients.Groups("Come2Chat").SendAsync("OnlineUsers", onlineUsers);
        }

        private string GetPrivateGroupName(string from , string to)
        {
            //from: john to: david return "david-john"

            var stringCompare = string.CompareOrdinal(from, to) < 0 ;

            return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
        }
    }
}
