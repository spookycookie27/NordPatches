using Microsoft.EntityFrameworkCore.Migrations;

namespace NordSamples.Migrations
{
    public partial class ChildPatches : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "Patch",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PatchId",
                table: "Patch",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "File",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NufUserId",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Patch_ParentId",
                table: "Patch",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patch_Patch_ParentId",
                table: "Patch",
                column: "ParentId",
                principalTable: "Patch",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patch_Patch_ParentId",
                table: "Patch");

            migrationBuilder.DropIndex(
                name: "IX_Patch_ParentId",
                table: "Patch");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Patch");

            migrationBuilder.DropColumn(
                name: "PatchId",
                table: "Patch");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "File");

            migrationBuilder.DropColumn(
                name: "NufUserId",
                table: "AspNetUsers");
        }
    }
}
