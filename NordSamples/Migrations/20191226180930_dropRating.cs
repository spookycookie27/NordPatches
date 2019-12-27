using Microsoft.EntityFrameworkCore.Migrations;

namespace NordSamples.Migrations
{
    public partial class dropRating : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rating");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatchId = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<int>(type: "int", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rating", x => x.Id);
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
    }
}
