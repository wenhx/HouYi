namespace HouYi.Models;

public enum HiringStatus
{
    NotHired,               // 未录用
    Hired,                  // 已录用
    OfferSent,              // 已发Offer
    OfferAccepted,          // Offer已接受
    OfferRejected,          // Offer被拒绝
    Onboarded,              // 已入职
    LeftBeforeGuarantee     // 未满保护期离职
}