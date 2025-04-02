using HouYi.Infrastructure;
using HouYi.Infrastructure.Extensions;
using HouYi.Models;
using HouYi.Models.Resumes;
using HouYi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace HouYi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResumesController(IResumeService _resumeService) : ControllerBase
{
    // GET: api/Resumes
    [HttpGet]
    public async Task<ActionResult<PagedResult<Resume>>> GetResumesAsync(
        int pageIndex,
        int pageSize,
        string? searchField = null,
        string? searchTerm = null,
        Gender? gender = null,
        CurrentStatus? currentStatus = null,
        Degree? degree = null,
        ResumeSource? source = null)
    {
        var result = await _resumeService.GetResumesAsync(
            pageIndex,
            pageSize,
            searchField,
            searchTerm,
            gender,
            currentStatus,
            degree,
            source);
        return result;
    }

    // PUT: api/Resumes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<ActionResult<InvokedResult>> UpdateResumePropertyAsync(string id, NameValueRecord<JsonElement> data)
    {
        var value = data.Value.ToObject();
        var result = await _resumeService.UpdateResumePropertyAsync(id, data.Name, value);
        return Ok(result);
    }

    // DELETE: api/Resumes/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteResumeAsync(string id)
    {
        return await _resumeService.DeleteResumeAsync(id);
    }
}