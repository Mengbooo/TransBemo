// 有道翻译API支持的语言映射
// 参考文档：https://openapi.youdao.com/doc

// 定义语言标签对象的类型
export type YoudaoLanguageLabels = {
    [key: string]: string;
};

// 有道翻译API支持的语言代码到中文名称的映射
export const youdaoLanguageLabels: YoudaoLanguageLabels = {
    "zh-CHS": "中文",
    "en": "英语",
    "en-AUS": "英语（澳大利亚）",
    "en-GBR": "英语（英国）",
    "en-IND": "英语（印度）",
    "ja": "日语",
    "ko": "韩语",
    "fr": "法语",
    "es": "西班牙语",
    "pt": "葡萄牙语",
    "ru": "俄语",
    "de": "德语",
    "ar": "阿拉伯语",
    "id": "印尼语",
    "ca": "加泰隆语",
    "cs": "捷克语",
    "da": "丹麦语",
    "el": "希腊语",
    "fi": "芬兰语",
    "fr-CAN": "法语（加拿大）",
    "he": "希伯来语",
    "hi": "印地语",
    "hu": "匈牙利语",
    "it": "意大利语",
    "nl": "荷兰语",
    "no": "挪威语",
    "pl": "波兰语",
    "pt-BRA": "葡萄牙语（巴西）",
    "ro": "罗马尼亚语",
    "sk": "斯洛伐克语",
    "sv": "瑞典语",
    "th": "泰语",
    "tr": "土耳其语",
    "yue": "粤语",
    "zh-TWN": "普通话（中国台湾）"
};

// 中文名称到有道翻译API语言代码的映射
export const chineseToYoudaoLanguage: YoudaoLanguageLabels = {
    "中文": "zh-CHS",
    "英语": "en",
    "英语（澳大利亚）": "en-AUS",
    "英语（英国）": "en-GBR",
    "英语（印度）": "en-IND",
    "日语": "ja",
    "韩语": "ko",
    "法语": "fr",
    "西班牙语": "es",
    "葡萄牙语": "pt",
    "俄语": "ru",
    "德语": "de",
    "阿拉伯语": "ar",
    "印尼语": "id",
    "加泰隆语": "ca",
    "捷克语": "cs",
    "丹麦语": "da",
    "希腊语": "el",
    "芬兰语": "fi",
    "法语（加拿大）": "fr-CAN",
    "希伯来语": "he",
    "印地语": "hi",
    "匈牙利语": "hu",
    "意大利语": "it",
    "荷兰语": "nl",
    "挪威语": "no",
    "波兰语": "pl",
    "葡萄牙语（巴西）": "pt-BRA",
    "罗马尼亚语": "ro",
    "斯洛伐克语": "sk",
    "瑞典语": "sv",
    "泰语": "th",
    "土耳其语": "tr",
    "粤语": "yue",
    "普通话（中国台湾）": "zh-TWN"
};

// 百度API语言代码到有道API语言代码的映射
export const baiduToYoudaoLanguage: YoudaoLanguageLabels = {
    "zh": "zh-CHS",
    "en": "en",
    "jp": "ja",
    "kor": "ko",
    "fra": "fr",
    "spa": "es",
    "ru": "ru",
    "pt": "pt",
    "de": "de",
    "it": "it",
    "dan": "da",
    "nl": "nl",
    "may": "id", // 马来语映射到印尼语
    "swe": "sv",
    "id": "id",
    "pl": "pl",
    "rom": "ro",
    "tr": "tr",
    "el": "el",
    "hu": "hu"
};

// 有道API支持的语言列表（中文名称）
export const youdaoLanguageArray: string[] = [
    "中文", "英语", "英语（澳大利亚）", "英语（英国）", "英语（印度）", 
    "日语", "韩语", "法语", "西班牙语", "葡萄牙语", "俄语", "德语", 
    "阿拉伯语", "印尼语", "加泰隆语", "捷克语", "丹麦语", "希腊语", 
    "芬兰语", "法语（加拿大）", "希伯来语", "印地语", "匈牙利语", 
    "意大利语", "荷兰语", "挪威语", "波兰语", "葡萄牙语（巴西）", 
    "罗马尼亚语", "斯洛伐克语", "瑞典语", "泰语", "土耳其语", 
    "粤语", "普通话（中国台湾）"
];

// 获取有道API语言代码
export const getYoudaoLanguageCode = (languageName: string): string => {
    return chineseToYoudaoLanguage[languageName] || "zh-CHS";
};

// 从百度API语言代码转换为有道API语言代码
export const convertBaiduToYoudaoLanguage = (baiduCode: string): string => {
    return baiduToYoudaoLanguage[baiduCode] || "zh-CHS";
}; 