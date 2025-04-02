using System.Text;

namespace HouYi.Data.Utils;

public static class PinyinConverter
{
    private static readonly Dictionary<char, string> PinyinMap = new()
    {
        // Surnames (��������)
        {'��', "li"}, {'��', "wang"}, {'��', "zhang"}, {'��', "liu"}, {'��', "chen"},
        {'��', "yang"}, {'��', "huang"}, {'��', "zhao"}, {'��', "zhou"}, {'��', "wu"},
        {'֣', "zheng"}, {'��', "sun"}, {'Ǯ', "qian"}, {'��', "lin"}, {'��', "guo"},
        {'��', "he"}, {'��', "ma"}, 
        
        // Given names (��������)
        {'־', "zhi"}, {'��', "jian"}, {'��', "wen"}, {'��', "ming"}, {'��', "de"},
        {'��', "hua"}, {'ΰ', "wei"}, {'��', "dong"}, {'��', "hai"}, {'ƽ', "ping"},
        {'��', "guo"}, {'ǿ', "qiang"}, {'��', "xiao"}, {'��', "feng"}, {'��', "jun"},
        {'��', "bo"}, {'˼', "si"}, {'��', "hao"}, {'��', "tian"}, {'��', "zi"},
        {'Զ', "yuan"}, {'��', "yu"}, {'��', "xuan"}, {'��', "hao"}, {'Ȼ', "ran"},
        {'��', "chao"}, {'��', "fei"}, {'��', "xin"}, {'��', "lei"}, {'��', "ze"},
        {'��', "cheng"}, {'��', "en"}, {'��', "liang"}, {'��', "hang"}, {'��', "qing"},
        {'��', "yu"}, {'��', "yang"}, {'��', "ning"}, {'��', "xiang"}, {'��', "chen"},
        {'�', "hao"}, {'Ĭ', "mo"}, {'��', "you"}, {'��', "yi"}, {'��', "liang"},
        {'��', "jun"}, {'��', "jie"}, {'Դ', "yuan"}, {'��', "chang"}
    };

    public static string ToPinyin(string chinese)
    {
        if (string.IsNullOrEmpty(chinese))
            return string.Empty;

        var result = new StringBuilder();
        foreach (char c in chinese)
        {
            if (PinyinMap.TryGetValue(c, out string? pinyin))
            {
                result.Append(pinyin);
            }
        }
        return result.ToString().ToLower();
    }
}
