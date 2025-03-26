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
    public async Task<ActionResult<PagedResult<Resume>>> GetResumesAsync(int pageIndex, int pageSize)
    {
        var result = await _resumeService.GetResumesAsync(pageIndex, pageSize);
        return result;
    }

    // PUT: api/Resumes/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<ActionResult<bool>> UpdateResumePropertyAsync(string id, NameValueRecord<JsonElement> data)
    {
        return await _resumeService.UpdateResumePropertyAsync(id, data.Name, GetValueFromJson(data.Value));
    }

    private object? GetValueFromJson(JsonElement value)
    {
        switch (value.ValueKind)
        {
            case JsonValueKind.String:
                return value.GetString();
            case JsonValueKind.Number:
                var number = value.GetDouble();
                switch (number)
                {
                    case >= Byte.MinValue and <= Byte.MaxValue:
                        return (byte)number;
                    case >= Int16.MinValue and <= Int16.MaxValue:
                        return (short)number;
                    case >= Int32.MinValue and <= Int32.MaxValue:
                        return (int)number;
                    default:
                        return number;
                }
            case JsonValueKind.True:
                return true;
            case JsonValueKind.False:
                return false;
            case JsonValueKind.Null:
                return null;
            default:
                return value.ToString();
        }
    }

    // DELETE: api/Resumes/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteResumeAsync(string id)
    {
        return await _resumeService.DeleteResumeAsync(id);
    }

    [HttpPut("PutTest")]
    public ActionResult<string> Post22<T>(string id, NameValueRecord<T> data)
    {
        return DateTime.Now.ToString() + ", " + id + ", " + data.ToString();
    }
}