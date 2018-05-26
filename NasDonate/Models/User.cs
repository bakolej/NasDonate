namespace NasDonate.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Alias { get; set; }
        public string Wallet { get; set; }
        public FileModel Avatar { get; set; }
    }
}
