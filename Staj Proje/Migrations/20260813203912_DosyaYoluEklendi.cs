using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Staj_Proje.Migrations
{
    /// <inheritdoc />
    public partial class DosyaYoluEklendi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MusteriAdSoyad",
                table: "Tickets",
                newName: "musteriAdSoyad");

            migrationBuilder.AddColumn<string>(
                name: "DosyaYolu",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DosyaYolu",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "musteriAdSoyad",
                table: "Tickets",
                newName: "MusteriAdSoyad");
        }
    }
}
