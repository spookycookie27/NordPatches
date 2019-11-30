using Microsoft.EntityFrameworkCore.Migrations;

namespace NordSamples.Migrations
{
    public partial class nufEMail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "NufUser",
                maxLength: 255,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "NufUser");
        }
    }
}
