using System.Text;

namespace HouYi.Data.Utils;

public static class PinyinConverter
{
    private static readonly Dictionary<char, string> PinyinMap = new()
    {
        // Surnames (常用姓氏)
        {'李', "li"}, {'王', "wang"}, {'张', "zhang"}, {'刘', "liu"}, {'陈', "chen"},
        {'杨', "yang"}, {'黄', "huang"}, {'赵', "zhao"}, {'周', "zhou"}, {'吴', "wu"},
        {'郑', "zheng"}, {'孙', "sun"}, {'钱', "qian"}, {'林', "lin"}, {'郭', "guo"},
        {'何', "he"}, {'马', "ma"}, 
        
        // Given names (常用名字)
        {'志', "zhi"}, {'建', "jian"}, {'文', "wen"}, {'明', "ming"}, {'德', "de"},
        {'华', "hua"}, {'伟', "wei"}, {'东', "dong"}, {'海', "hai"}, {'平', "ping"},
        {'国', "guo"}, {'强', "qiang"}, {'晓', "xiao"}, {'峰', "feng"}, {'军', "jun"},
        {'博', "bo"}, {'思', "si"}, {'浩', "hao"}, {'天', "tian"}, {'子', "zi"},
        {'远', "yuan"}, {'宇', "yu"}, {'轩', "xuan"}, {'豪', "hao"}, {'然', "ran"},
        {'超', "chao"}, {'飞', "fei"}, {'鑫', "xin"}, {'磊', "lei"}, {'泽', "ze"},
        {'承', "cheng"}, {'恩', "en"}, {'亮', "liang"}, {'航', "hang"}, {'青', "qing"},
        {'雨', "yu"}, {'阳', "yang"}, {'宁', "ning"}, {'翔', "xiang"}, {'辰', "chen"},
        {'皓', "hao"}, {'默', "mo"}, {'佑', "you"}, {'奕', "yi"}, {'良', "liang"},
        {'俊', "jun"}, {'杰', "jie"}, {'源', "yuan"}, {'长', "chang"}
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