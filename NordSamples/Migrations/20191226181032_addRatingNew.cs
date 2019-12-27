using Microsoft.EntityFrameworkCore.Migrations;

namespace NordSamples.Migrations
{
    public partial class addRatingNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    AppUserId = table.Column<string>(maxLength: 450, nullable: false),
                    PatchId = table.Column<int>(nullable: false),
                    Value = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rating", x => new { x.AppUserId, x.PatchId });
                    table.ForeignKey(
                        name: "FK_Rating_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rating_Patch_PatchId",
                        column: x => x.PatchId,
                        principalTable: "Patch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rating_PatchId",
                table: "Rating",
                column: "PatchId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rating");
        }
    }
}
