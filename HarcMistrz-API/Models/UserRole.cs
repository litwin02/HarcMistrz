using HarcMistrz_API.Common;

namespace HarcMistrz_API.Models
{
	public class UserRole
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public RolesEnum Role { get; set; }
		

		public User? User { get; set; }
	}
}
