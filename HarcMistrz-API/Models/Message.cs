using MongoDB.Bson;

namespace HarcMistrz_API.Models
{
	public class Message
	{
		public ObjectId Id { get; set; }
		public int SenderId { get; set; }
		public int ReceiverId { get; set; }
		public string? Content { get; set; }
		public DateTime TimeStamp { get; set; }
	}
}
