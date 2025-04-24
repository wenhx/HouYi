using System.Diagnostics.CodeAnalysis;

namespace HouYi.Models;

public class PositionWithIntValue : Position
{
    public int IntNumber
    {
        get => Number;
        set => Number = (byte)value;
    }

    [SetsRequiredMembers]
    public PositionWithIntValue(Position position)
    {
        if (position == null)
            throw new ArgumentNullException(nameof(position));

        Id = position.Id;
        Name = position.Name;
        Description = position.Description;
        Number = position.Number;
        Status = position.Status;
        CustomerId = position.CustomerId;
        Customer = position.Customer;
        ConsultantId = position.ConsultantId;
        Consultant = position.Consultant;
        CreatedAt = position.CreatedAt;
        UpdatedAt = position.UpdatedAt;
    }
}