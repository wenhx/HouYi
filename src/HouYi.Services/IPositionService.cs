﻿using HouYi.Models;

namespace HouYi.Services;

public interface IPositionService
{
    Task<PagedResult<Position>> GetPositionsAsync(int pageNumber = 1, int pageSize = 10, PositionStatus? status = null);
    Task<PagedResult<Position>> FindPositionsAsync(string term = "", int pageNumber = 1, int pageSize = 10, PositionStatus? status = null);
    Task<Position?> GetPositionByIdAsync(int id);
    Task UpdatePositionAsync(Position position);
    Task DeletePositionAsync(int id);
    Task<Position> CreatePositionAsync(Position position);
} 