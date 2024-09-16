namespace HarcMistrz_API.Models
{
	public class TeamMember
	{
		public int Id { get; set; }
		public int TeamId { get; set; }
		public int MemberId { get; set; }
		public bool IsLeader { get; set; }


		public Team? Team { get; set; }
		public User? Member { get; set; }
	}
}
