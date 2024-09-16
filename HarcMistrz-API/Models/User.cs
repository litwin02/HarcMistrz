namespace HarcMistrz_API.Models
{
	public class User
	{
		public int Id { get; set; }
		public string? FirstName { get; set; }
		public string? LastName { get; set; }
		public string? PhoneNumber { get; set; }
		public string? Email { get; set; }
		public string? Password { get; set; }


		public ICollection<UserRole>? UserRoles { get; set; }
		public ICollection<TeamMember>? TeamMembers { get; set; }
		public ICollection<Payments>? Payments { get; set; }
	}
}
