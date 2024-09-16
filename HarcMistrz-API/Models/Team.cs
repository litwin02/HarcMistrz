namespace HarcMistrz_API.Models
{
	public class Team
	{
		public int Id { get; set; }
		public string? Name { get; set; }
		public string? Description { get; set; }
		public string? Logo { get; set; }


		public ICollection<TeamMember>? TeamMembers { get; set; }
		public ICollection<Meeting>? Meetings { get; set; }
	}
}
