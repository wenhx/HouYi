namespace HouYi.Models;

public enum CommunicationMethod : byte
{
    Other = 0,
    Phone = 1,
    Email = 2,
    /// <summary>
    /// 即时消息
    /// </summary>
    IM = 3,
    Video = 4,
    FaceToFace = 5
}