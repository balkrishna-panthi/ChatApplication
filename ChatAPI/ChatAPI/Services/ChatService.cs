using System.Collections.Generic;
using System.Linq;

namespace ChatAPI.Services
{
    public class ChatService
    {
        private static readonly Dictionary<string , string> Users  = new Dictionary<string , string>();
        public bool AddUserToList(string userToAdd)
        {
            lock(Users)
            {
                foreach(var user in Users)
                {
                    if(user.Key.ToLower() == userToAdd.ToLower())
                    {
                        return false;
                    }
                }
                Users.Add(userToAdd, null);
                return true;
            }
        }

        public void AddUserConnectionId(string user , string connectionId)
        {
            lock(Users)
            {
                foreach(var usr in Users) 
                {
                    if (Users.ContainsKey(user))
                    {
                        Users[user] = connectionId;
                    }
                }
            }
        }

        public string GetUserByConnectionId(string connectionId)
        {
            lock(Users)
            {
                return Users.Where(user => user.Value ==connectionId).Select(user=>user.Key).FirstOrDefault();
            }
        }
        public string GetConnectionIdByUser(string user)
        {
            lock (Users)
            {
                return Users.Where(x => x.Key == user).Select(x => x.Value).FirstOrDefault();
            }
        }

        public void RemoveUserFromList(string user)
        {
            lock (Users)
            {
                if (Users.ContainsKey(user))
                {
                    Users.Remove(user);
                }
            }
        }

        public string[] GetOnlineUsers()
        {
            lock (Users)
            {
                return Users.OrderBy(user=> user.Key).Select(user=>user.Key).ToArray();
            }
        }
    }
}
