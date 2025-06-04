# 音频文件转码

**更新时间：** 2024-05-29

## 简介

本文描述如何从其它格式的音频转成符合语音识别输入要求格式的音频文件。即4种格式的音频文件：

- **pcm**（不压缩），也称为raw格式。音频输入最原始的格式，不用再解码。
- **wav**（不压缩，pcm编码）：在pcm文件的开头出上加上一个描述采样率，编码等信息的字节。
- **amr**（有损压缩格式），对音频数据进行有损压缩，类似mp3文件。
- **m4a**（有损压缩格式，AAC编码），对音频数据进行有损压缩，通常仅供微信小程序使用的格式。自行转换比较复杂。

由于底层识别使用的是pcm，因此推荐直接上传pcm文件。如果上传其它格式，会在服务器端转码成pcm，调用接口的耗时会增加。

## 音频参数概念

- **采样率：** 百度语音识别一般仅支持16000的采样率。即1秒采样16000次。
- **位深：** 无损音频格式pcm和wav可以设置，百度语音识别使用16bits 小端序，即2个字节记录1/16000 s的音频数据。
- **声道：** 百度语音识别仅支持单声道。

以16000采样率 16bits 编码的pcm文件为例，每个16bits(=2bytes)记录了 1/16000s的音频数据。即1s的音频数据为 2bytes * 16000 = 32000B

以下表格的的格式要求仅供参考，具体以调用的api或sdk的文档为准。

| api或sdk | 大类 | 采样率 | 文件格式 | 声道 | pcm 及wav 编码 |
| --- | --- | --- | --- | --- | --- |
| restapi | 语音识别 | 16000 | pcm，wav，amr，m4a | 单声道 | 16bits 小端序 |
| android ios linux C++ SDK | 语音识别 | 16000 | pcm | 单声道 | 16bits 小端序 |
| SDK mrcp server等 | 呼叫中心 | 8000 | pcm | 单声道 | 16bits 小端序 |

## 示例音频文件下载

## 音频播放

- **pcm 播放**：使用AudioAudition，选择 16000采样率；16位PCM；Little-Endian（即默认字节序）
- **wav, m4a 播放**：使用AudioAudition 或 完美解码
- **amr 播放**：使用完美解码

## 转换命令示例

### wav 文件转 16k 16bits 位深的单声道pcm文件

```bash
ffmpeg -y -i 16k.wav -acodec pcm_s16le -f s16le -ac 1 -ar 16000 16k.pcm
```

### 44100 采样率 单声道 16bts pcm 文件转 16000采样率 16bits 位深的单声道pcm文件

```bash
ffmpeg -y -f s16le -ac 1 -ar 44100 -i test44.pcm -acodec pcm_s16le -f s16le -ac 1 -ar 16000 16k.pcm
```

### mp3 文件转 16K 16bits 位深的单声道 pcm文件

```bash
ffmpeg -y -i aidemo.mp3 -acodec pcm_s16le -f s16le -ac 1 -ar 16000 16k.pcm
```

参数说明：
- `-acodec pcm_s16le` pcm_s16le 16bits 编码器
- `-f s16le` 保存为16bits pcm格式
- `-ac 1` 单声道
- `-ar 16000` 16000采样率

正常输出如下：

```
Input #0, mp3, from 'aaa.mp3':
  Metadata:
    encoded_by      : Lavf52.24.1
  Duration: 00:02:33.05, start: 0.000000, bitrate: 128 kb/s
    Stream #0:0: Audio: mp3, 44100 Hz, stereo, s16p, 128 kb/s
// 输入音频， MP3格式， 44100采样率，stereo-双声道， 16bits 编码

Output #0, s16le, to '16k.pcm':
  Metadata:
    encoded_by      : Lavf52.24.1
    encoder         : Lavf57.71.100
    Stream #0:0: Audio: pcm_s16le, 16000 Hz, mono, s16, 256 kb/s

// 输入音频， MP3格式， 16000采样率，mono-单声道， 16bits
// 256 kb/s = 32KB/s = 32B/ms
```

## ffmpeg 使用说明

### 简介

ffmpeg 的一个功能是转换不同的音频格式，其它简介请至 http://ffmpeg.org/

- linux 版本：http://www.ffmpeg.org/download.html#build-linux 
- linux 静态编译版本：https://www.johnvansickle.com/ffmpeg/ 
- windows 版本：http://ffmpeg.org/download.html#build-windows

ffmpeg官方文档地址：http://ffmpeg.org/ffmpeg.html

### 编译参数与支持格式

ffmpeg默认支持pcm与wav（pcm编码）格式，额外的编译参数如下：

- `--enable-libopencore-amrnb` 支持amr-nb(8000 采样率) 读写
- `--enable-libopencore-amrwb` 支持amr-wb(16000 采样率) 读取
- `--enable-libvo-amrwbenc` 支持amr-wb(16000 采样率) 写入
- `--enable-libmp3lame` 支持mp3 写入
- `--enable-libfdk-aac` 使用libfdk作为aac的编码和解码格式

`ffmpeg -codecs` 可以查看所有的格式：
```
D..... = Decoding supported  # 读取
.E.... = Encoding supported  # 写入
..A... = Audio codec      # 音频编码
....L. = Lossy compression # 有损
.....S = Lossless compression # 无损
DEA..S pcm_s16le            PCM signed 16-bit little-endian
DEA.LS wavpack              WavPack
DEA.L. mp3  MP3 (MPEG audio layer 3)
DEA.L. amr_nb       AMR-NB (Adaptive Multi-Rate NarrowBand)
DEA.L. amr_wb       AMR-WB (Adaptive Multi-Rate WideBand)
DEA.L. aac          AAC (Advanced Audio Coding) (decoders: aac aac_fixed )
或
DEA.L. aac          AAC (Advanced Audio Coding) (decoders: aac aac_fixed libfdk_aac ) (encoders: aac libfdk_aac )
```

### ffmpeg命令

```bash
ffmpeg {通用参数} {输入音频参数} {输出音频参数}
```

例如：
```bash
ffmpeg -y -i aidemo.mp3 -acodec pcm_s16le -f s16le -ac 1 -ar 16000 16k.pcm
```

- 通用参数： `-y`
- 输入音频mp3文件参数： `-i aidemo.mp3`
- 输出音频 16000采样率 单声道 pcm 格式： `-acodec pcm_s16le -f s16le -ac 1 -ar 16000 16k.pcm`

示例： 
输入是 32000HZ的单声道 16bits pcm文件。查询下文的输入参数为 `-f s16le -ac 1 -ar 32000 -i test32.pcm`
输出是 16000HZ的单声道 16bits pcm文件。查询下文的输出参数为 `-f s16le -ac 1 -ar 16000 16k.pcm`
常用参数选择 `-y`

合并如下：

```bash
ffmpeg -y -f s16le -ac 1 -ar 32000 -i test32.pcm -f s16le -ac 1 -ar 16000 16k.pcm
```

### 输入音频参数

wav、amr、mp3及m4a格式都自带头部，含有采样率 编码 多声道等信息。而pcm为原始音频信息，没有类似头部。wav（pcm编码）格式，仅仅在同样参数的pcm文件加了个几个字节的文件头。

#### 输入 wav、amr、mp3及m4a 等格式：

```bash
-i test.wav # 或test.mp3 或者 test.amr
```

#### 输入 pcm格式： 
pcm需要额外告知编码格式，采样率，单声道信息

```bash
-acodec pcm_s16le -f s16le -ac 1 -ar 16000 -i 8k.pcm
```
// 单声道 16000 采样率 16bits编码 pcm文件

// s16le s(signied)16(16bits)le(Little-Endian)
- `-acodec pcm_s16le`：使用s16le进行编码
- `-f s16le` 文件格式是s16le的pcm
- `-ac 1` ：单声道
- `-ar 16000` ： 16000采样率

### 输出音频参数

在原始采样率 大于或者接近16000的时候，推荐使用16000的采样率。8000的采样率会降低识别效果。输出wav和amr格式时，如果不指定输出编码器，ffmpeg会选取默认编码器。

#### 输出pcm音频：

```bash
-f s16le -ac 1 -ar 16000 16k.pcm
```
// 单声道 16000 采样率 16bits编码 pcm文件

#### 输出wav 音频：

```bash
-ac 1 -ar 16000 16k.wav
```
// 单声道 16000 采样率 16bits编码 pcm编码的wav文件

#### 输出amr-nb 音频：

全称是：Adaptive Multi-Rate，自适应多速率，是一种音频编码文件格式，专用于有效地压缩语音频率。在带宽不是瓶颈的情况下，不建议选择这种格式，解压需要百度服务器额外的耗时。amr-nb格式只能选 8000采样率。bit rates越高音质越好，但是文件越大。bit rates 4.75k, 5.15k, 5.9k, 6.7k, 7.4k, 7.95k, 10.2k or 12.2k

8000的采样率及有损压缩会降低识别效果。如果原始采样率大于16000，请使用 amr-wb格式。

```bash
-ac 1 -ar 8000 -ab 12.2k 8k-122.amr
```
// 8000 采样率 12.2 bitRates

#### 输出 amr-wb 格式：
采样率 16000。bit rates越高音质越好，但是文件越大。6600 8850 12650 14250 15850 18250 19850 23050 23850

```bash
-acodec amr_wb -ac 1 -ar 16000 -ab 23850 16k-23850.amr
```

#### 输出m4a文件：

m4a文件一般来源于微信小程序录音（见restapi文档中微信录音小程序的参数说明）。不建议其它格式转为m4a；推荐转为amr有损压缩格式调用restapi。

如果您一定要转为百度支持的m4a格式，见后文的m4a文件转码

### 常用参数

- `-y` 覆盖同名文件
- `-v` 日志输出基本 如 `-v ERROR` `-v quiet` 等

## 查看音频格式ffprobe使用

查看语音合成生成的MP3格式信息：

```bash
ffprobe -v quiet -print_format json -show_streams aidemo.mp3
```

返回如下：

```json
{
    "streams": [
        {
            "index": 0,
            "codec_name": "mp3", // mp3 格式
            "codec_long_name": "MP3 (MPEG audio layer 3)",
            "codec_type": "audio",
            "codec_time_base": "1/16000",
            "codec_tag_string": "[0][0][0][0]",
            "codec_tag": "0x0000",
            "sample_fmt": "s16p",
            "sample_rate": "16000", // 16000采样率
            "channels": 1, // 单声道
            "channel_layout": "mono",
            "bits_per_sample": 0,
            "r_frame_rate": "0/0",
            "avg_frame_rate": "0/0",
            "time_base": "1/14112000",
            "start_pts": 0,
            "start_time": "0.000000",
            "duration_ts": 259096320,
            "duration": "18.360000",
            "bit_rate": "16000",
            "disposition": {
                "default": 0,
                "dub": 0,
                "original": 0,
                "comment": 0,
                "lyrics": 0,
                "karaoke": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "visual_impaired": 0,
                "clean_effects": 0,
                "attached_pic": 0,
                "timed_thumbnails": 0
            }
        }
    ]
}
```

## pcm文件音频时长计算

同图像bmp文件一样，pcm文件保存的是未压缩的音频信息。16bits 编码是指，每次采样的音频信息用2个字节保存。可以对比下bmp文件用分别用2个字节保存RGB颜色的信息。16000采样率 是指 1秒钟采样 16000次。常见的音频是44100HZ，即一秒采样44100次。单声道：只有一个声道。

根据这些信息，我们可以计算：
- 1秒的16000采样率音频文件大小是 2*16000 = 32000字节，约为32K
- 1秒的8000采样率音频文件大小是 2*8000 = 16000字节，约为 16K

如果已知录音时长，可以根据文件的大小计算采样率是否正常。

## 转换为m4a格式（AAC编码）

推荐使用amr有损压缩格式，m4a格式用于微信小程序的录音。

需要下载MP4Box，用于转换brand 为mp42:0, mini Version 0。restapi不支持brand M4A。点此下载，选Current release里的下载链接。

ffmpeg 官方推荐使用libfdk_aac 库，但这个库需要按照官方文档自行编译。如果使用静态版本的话，也可以使用ffmpeg自带的aac库。

### 编译过libfdk_aac ffmpeg 示例

```bash
ffmpeg -y -f s16le -ac 1 -ar 16000 -i 16k_57test.pcm -c libfdk_aac -profile:a aac_low -b:a 48000 -ar 16000 -ac 1 16k.m4a
MP4Box -brand mp42:0 16k.m4a #这步不能忽略
```

### 静态版本自带的aac库示例

```bash
ffmpeg -y -f s16le -ac 1 -ar 16000 -i 16k_57test.pcm -c aac -profile:a aac_low -b:a 48000 -ar 16000 -ac 1 16k.m4a 
MP4Box -brand mp42:0 16k.m4a #这步不能忽略
```

### 输出参数

- `-c` 选编码库 libfdk_aac或者aac
- `-profile:a` profile固定选aac_low（AAC-LC），restapi不支持 例如HE-AAC，LD，ELD等
- `-b:a` bitrates，16000采样率对应的bitrates CBR 范围为 24000-96000。越大的话，失真越小，但是文件越大
- `-ar` 采样率，一般固定16000
- `-ac` 固定1，单声道

### 查看 m4a 格式

```bash
ffprobe 16k.m4a
```

下面结果中重要的字段：

```
Metadata: major_brand : mp42 minor_version : 0 compatible_brands: isomiso2M4A mp42 encoder : Lavf58.20.100 Duration: 00:00:56.26, start: 0.000000, bitrate: 32 kb/s Stream #0:0(und): Audio: aac (LC) (mp4a / 0x6134706D), 16000 Hz, mono, fltp, 32 kb/s (default)
```