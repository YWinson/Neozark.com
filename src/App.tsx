/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { Menu, X, Play, MapPin, Mail, Phone, Instagram, Music, Youtube, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function VideoCard({ video }: any) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 检测是否为 Bilibili 链接
  const isBilibili = video.videoUrl.includes('bilibili.com');
  
  // 提取 Bilibili BVID
  const getBiliEmbedUrl = (url: string) => {
    const match = url.match(/BV[a-zA-Z0-9]+/);
    if (match) {
      return `//player.bilibili.com/player.html?bvid=${match[0]}&page=1&high_quality=1&as_wide=1&allowfullscreen=true`;
    }
    return url;
  };

  const togglePlay = () => {
    if (isBilibili) {
      setIsPlaying(true);
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative group cursor-pointer overflow-hidden bg-black rounded-sm shadow-2xl border border-white/5 aspect-video">
      {isBilibili && isPlaying ? (
        <iframe
          src={getBiliEmbedUrl(video.videoUrl)}
          scrolling="no"
          border="0"
          frameBorder="no"
          framespacing="0"
          allowFullScreen={true}
          className="w-full h-full"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={isBilibili ? undefined : video.videoUrl}
            poster={video.thumbnail}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isPlaying ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
            }`}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          />
          
          {/* 播放按钮遮罩 */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isPlaying ? 'bg-transparent opacity-0 hover:opacity-100 hover:bg-black/20' : 'bg-black/40 opacity-100'
            }`}
            onClick={togglePlay}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-[#e63946] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(230,57,70,0.5)]"
            >
              {isPlaying ? (
                <Pause fill="white" size={32} />
              ) : (
                <Play fill="white" size={32} className="ml-1" />
              )}
            </motion.div>
          </div>

          {/* 视频信息 */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <h3 className="font-bold text-xl mb-1">{video.title}</h3>
            <div className="flex items-center text-xs text-[#e63946] font-bold tracking-widest uppercase">
              <span className="bg-[#e63946] text-white px-2 py-0.5 mr-2 rounded-sm">
                {isBilibili ? 'BILIBILI' : 'LIVE'}
              </span>
              {video.date}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动，切换导航栏透明度
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', href: '#首页' },
    { name: '关于我们', href: '#关于我们' },
    { name: '乐队成员', href: '#乐队成员' },
    { name: '演出历程', href: '#演出历程' },
    { name: '视频作品', href: '#视频作品' },
    { name: '联系我们', href: '#联系我们' },
  ];

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // 关闭手机端菜单
    setIsMenuOpen(false);

    const targetId = decodeURIComponent(href.replace('#', ''));
    let element = document.getElementById(targetId);
    
    // 备选方案：通过 querySelector 查找
    if (!element) {
      element = document.querySelector(`[id="${targetId}"]`);
    }
    
    if (element) {
      // 延迟一小会儿执行滚动，确保菜单关闭动画不影响位置计算
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const members = [
    { name: '旋转球', role: '主唱 / 节奏吉他', desc: '深圳技术大学音乐协会成员。乐队主心骨，是乐队坚强后盾及决策敲定人。' },
    { name: '摇滚丸', role: '主音吉他', desc: '八年演奏经验。用琴弦说话，为每个音符注入灵魂热度。' },
    { name: '骆驼', role: '贝斯', desc: '潮汕百合杯优秀乐手，全国校园歌手省级选手。' },
    { name: '长颈鹿', role: '鼓手', desc: '少年鼓手，八年沉淀让他功夫够硬。Live house里他如野马脱缰，吊镲声浪中翻涌着磨破的鼓皮与汗水。' },
    { name: '确认函', role: '键盘', desc: '古典钢琴琴龄14年，钢琴10级。乐队的音准担当。' },
  ];

  const tours = [
    { 
      date: '2024.10.26', 
      title: '汕尾陆河油柑丰收节音乐节，并被珠江卫视报道', 
      location: '汕尾陆河',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402004740_230_254.jpg?raw=true'
    },
    { 
      date: '2025.1.2', 
      title: '深圳高校音乐节', 
      location: 'MAO 海上世界店',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402004815_231_254.jpg?raw=true'
    },
    { 
      date: '2025.3.21', 
      title: '婚礼商单演出', 
      location: '深圳观澜湖度假酒店',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402004856_232_254.jpg?raw=true'
    },
    { 
      date: '2025.06.23', 
      title: '同柬埔寨公主进行新歌MV录制暨路演活动（受深圳广播电视台邀请）', 
      location: '深业上城',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402004926_233_254.jpg?raw=true'
    },
    { 
      date: '2025.12.30', 
      title: '元旦音乐嘉年华', 
      location: '深汕合作区',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260401223918_224_254.jpg?raw=true'
    },
    { 
      date: '2026.3.28', 
      title: '华凯易佰上市公司年会', 
      location: '燕子湖国际会展中心',
      image: 'https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260401223843_223_254.jpg?raw=true'
    },
  ];

  const videoWorks = [
    {
      title: '永不失联的爱',
      date: '2025.06.23',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/9a88de833c4013750de299d8bae2df371fad9015.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV1eA9EBrEu5/?share_source=copy_web&vd_source=156ce83d5268220b4f08d90328b6d141',
    },
    {
      title: '大石碎胸口',
      date: '2025.1.2',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/fa1b550b3ab0ea988c50919e8e96887c3256588f.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV17NrVYGEBQ/?share_source=copy_web&vd_source=1b51692012f78f5d952892bdcf40aa7b',
    },
    {
      title: '男孩别哭',
      date: '2026.3.28',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/8754214f2173a296ce16cb6285bfd20011a8673e.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV1eA9EBrETg/?share_source=copy_web&vd_source=156ce83d5268220b4f08d90328b6d141',
    },
    {
      title: '不再犹豫',
      date: '2024.12.22',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/846f3cfc42847ae5b5ace3bac13f7d87b011d780.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV1iRkvY3EBk/?share_source=copy_web&vd_source=156ce83d5268220b4f08d90328b6d141',
    },
    {
      title: '闪光的回忆',
      date: '2025.11.27',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/3d789d94af2a1e438df192d659ba1e66998f3cbc.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV15DSTBKELR/?share_source=copy_web&vd_source=156ce83d5268220b4f08d90328b6d141',
    },
    {
      title: '海阔天空',
      date: '2024.12.27',
      thumbnail: 'https://github.com/YWinson/Neozark/blob/main/444c194c5004ae96847e3f14186a93e69c6d8f85.jpg?raw=true',
      videoUrl: 'https://www.bilibili.com/video/BV1WxCHYmEYA/?share_source=copy_web&vd_source=156ce83d5268220b4f08d90328b6d141',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#e63946] selection:text-white">
      {/* 导航栏 */}
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          isScrolled ? 'bg-[#121212]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a 
            href="#首页" 
            onClick={(e) => scrollToSection(e, '#首页')}
            className="text-2xl font-black tracking-tighter text-[#e63946]"
          >
            NEOZARK
          </a>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium hover:text-[#e63946] transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 手机端菜单按钮 */}
          <button
            className="md:hidden text-white hover:text-[#e63946] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* 手机端折叠菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#121212] border-t border-white/10 overflow-hidden pointer-events-auto relative z-[101]"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-lg font-medium hover:text-[#e63946] block w-full py-2 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 首页 - 英雄区 */}
      <section id="首页" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* 黑色渐变蒙版：顶部和底部深，中间浅，确保文字和导航清晰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#121212] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        
        {/* 乐队宣传图 - 建议替换为您的真实图片路径 */}
        <img
          src="https://github.com/YWinson/Neozark/blob/main/DSC01514.JPG?raw=true"
          alt="Neozark 乐队宣传图"
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] brightness-[0.7] transition-transform duration-[10s] hover:scale-110"
          referrerPolicy="no-referrer"
        />

        <div className="relative z-20 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-[12rem] font-black italic tracking-tighter mb-2 leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              NEO<span className="text-[#e63946]">ZARK</span>
            </h1>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center justify-center space-x-4"
            >
              <div className="h-[2px] w-12 bg-[#e63946]" />
              <p className="text-xl md:text-3xl font-light tracking-[0.3em] text-white/90 uppercase drop-shadow-md">
                流行摇滚 · 深圳技术大学
              </p>
              <div className="h-[2px] w-12 bg-[#e63946]" />
            </motion.div>
            
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="#关于我们"
                onClick={(e) => scrollToSection(e, '#关于我们')}
                className="group relative inline-block bg-[#e63946] text-white px-10 py-4 text-xl font-black hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(230,57,70,0.4)]"
              >
                <span className="relative z-10">立即开启</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </a>
              <a
                href="#视频作品"
                onClick={(e) => scrollToSection(e, '#视频作品')}
                className="text-white/70 hover:text-[#e63946] font-bold tracking-widest transition-colors flex items-center gap-2"
              >
                <Play size={20} fill="currentColor" /> 观看演出视频
              </a>
            </div>
          </motion.div>
        </div>

        {/* 底部装饰：滚动引导 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">向下滚动</span>
          <div className="w-[2px] h-24 bg-gradient-to-b from-[#e63946] via-[#e63946]/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 关于我们 */}
      <section id="关于我们" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 border-l-8 border-[#e63946] pl-6">关于我们</h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
              <p>
                Neozark 乐队成立于深圳技术大学，是一支充满活力与创造力的流行摇滚乐队。我们致力于将现代流行元素与硬核摇滚精神相结合，用音乐表达当代大学生的热血与思考。
              </p>
              <p>
                从校园操场到城市舞台，我们的足迹见证了对音乐最纯粹的热爱。每一场演出，我们都全力以赴，只为在那一刻与观众产生最强烈的共鸣。
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 border-2 border-[#e63946] opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="https://github.com/YWinson/Neozark/blob/main/DSC01563.JPG?raw=true"
              alt="乐队排练"
              className="relative w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 乐队成员 */}
      <section id="乐队成员" className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-16 text-center italic">
            乐队<span className="text-[#e63946]">成员</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {members.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-[#1a1a1a] p-6 border-b-4 border-transparent hover:border-[#e63946] transition-all duration-300 flex flex-col"
              >
                <div className="w-20 h-20 bg-[#e63946] mb-6 rounded-full flex items-center justify-center text-2xl font-black italic shrink-0">
                  {member.name[0]}
                </div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-[#e63946] text-xs font-bold mb-4 tracking-widest uppercase">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 演出历程 */}
      <section id="演出历程" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black mb-16 border-l-8 border-[#e63946] pl-6">演出历程</h2>
        <div className="space-y-6">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="group flex flex-col lg:flex-row lg:items-center gap-6 p-6 bg-[#1a1a1a] hover:bg-[#222] border-l-4 border-transparent hover:border-[#e63946] transition-all duration-500 cursor-default"
            >
              <div className="relative w-full lg:w-48 h-32 shrink-0 overflow-hidden rounded-sm">
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-[#e63946] text-white text-[10px] font-black px-2 py-0.5 italic">
                  0{index + 1}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-[#e63946] transition-colors">{tour.title}</h3>
                  <p className="text-gray-500 flex items-center mt-1">
                    <MapPin size={14} className="mr-1 text-[#e63946]" /> {tour.location}
                  </p>
                </div>
                <div className="text-2xl font-black italic tracking-tighter text-gray-400 group-hover:text-white transition-colors">
                  {tour.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 视频作品 */}
      <section id="视频作品" className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-16 text-center italic">
            视频<span className="text-[#e63946]">作品</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoWorks.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section id="联系我们" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8 border-b-4 border-[#e63946] pb-4 inline-block">联系我们</h2>
          <p className="text-gray-400 mb-12 text-lg">
            无论是演出邀请、商务合作还是加入我们，欢迎通过以下方式取得联系。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="flex flex-col items-center p-8 bg-[#1a1a1a] rounded-sm border border-white/5 hover:border-[#e63946] transition-all group">
              <div className="relative w-48 h-48 mb-6 bg-white p-2 rounded-sm overflow-hidden">
                {/* 请将此处替换为您的 B站 真实二维码图片链接 */}
                <img 
                  src="https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402001941_228_254.jpg?raw=true" 
                  alt="Bilibili 二维码"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/biliqr/200/200";
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 uppercase font-bold mb-1 tracking-widest">Bilibili</p>
              <p className="text-xl font-bold mb-2">Neozark乐队</p>
              <p className="text-xs text-[#e63946] font-bold">扫码关注 B站 动态</p>
            </div>

            <div className="flex flex-col items-center p-8 bg-[#1a1a1a] rounded-sm border border-white/5 hover:border-[#e63946] transition-all group">
              <div className="relative w-48 h-48 mb-6 bg-white p-2 rounded-sm overflow-hidden">
                {/* 请将此处替换为您的 小红书 真实二维码图片链接 */}
                <img 
                  src="https://github.com/YWinson/Neozark/blob/main/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260402001943_229_254.jpg?raw=true" 
                  alt="小红书 二维码"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/xhsqr/200/200";
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 uppercase font-bold mb-1 tracking-widest">小红书</p>
              <p className="text-xl font-bold mb-2">Neozark乐队</p>
              <p className="text-xs text-[#e63946] font-bold">扫码关注 小红书 动态</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-black italic text-[#e63946] mb-2">NEOZARK</h2>
            <p className="text-gray-500 text-sm">© 2024 Neozark 乐队. 保留所有权利.</p>
            <p className="text-gray-600 text-xs mt-1">深圳技术大学 · 流行摇滚精神</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://space.bilibili.com/1475954566?spm_id_from=333.1007.0.0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#e63946] transition-colors flex items-center gap-2"
            >
              <Music size={20} /> <span className="text-xs font-bold">B站</span>
            </a>
            <a 
              href="https://xhslink.com/m/4WNbzjjSwgl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#e63946] transition-colors flex items-center gap-2"
            >
              <Instagram size={20} /> <span className="text-xs font-bold">小红书</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
