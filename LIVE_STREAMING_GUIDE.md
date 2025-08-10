# Live Streaming Setup Guide for Healing Word Church

## 🎥 Overview

This guide will help you set up live streaming for your church services using various platforms and integrate them into your website.

## 📋 Required Equipment

### Essential Hardware
- **Camera**: HD webcam (Logitech C920) or professional camera (Sony A7III)
- **Microphone**: USB microphone (Blue Yeti) or wireless system (Shure BLX)
- **Computer**: Windows/Mac with good processor (Intel i5 or better)
- **Internet**: Stable connection (minimum 10 Mbps upload speed)

### Optional Equipment
- **Lighting**: LED panels or softbox lights
- **Tripod**: For stable camera positioning
- **Audio Interface**: For multiple microphones
- **Streaming Encoder**: Hardware encoder for professional setups

## 🛠️ Software Options

### Free Options
1. **OBS Studio** (Recommended)
   - Free, powerful, professional-grade
   - Supports multiple scenes and sources
   - Works with all major platforms

2. **Streamlabs**
   - User-friendly interface
   - Built-in overlays and alerts
   - Free with premium features

### Paid Professional Options
1. **Vimeo Live** ($75/month)
   - Professional church streaming
   - No ads, high quality
   - Built-in chat and engagement tools

2. **Restream** ($16/month)
   - Stream to multiple platforms
   - Professional features
   - Analytics and engagement tools

## 📺 Platform Options

### YouTube Live (Free)
**Pros:**
- Free to use
- Large audience reach
- Good quality
- Automatic archiving

**Cons:**
- Shows ads
- Less control over branding
- Limited monetization

**Setup:**
1. Create YouTube channel
2. Enable live streaming (requires 1000 subscribers)
3. Use OBS Studio to stream
4. Embed on website

### Facebook Live (Free)
**Pros:**
- Free to use
- Good for community engagement
- Easy sharing
- Built-in chat

**Cons:**
- Lower quality than YouTube
- Limited archiving
- Algorithm-dependent

**Setup:**
1. Create Facebook page
2. Use Facebook Live Producer
3. Schedule or go live
4. Embed on website

### Vimeo Live (Paid)
**Pros:**
- Professional quality
- No ads
- Custom branding
- Advanced analytics
- Church-specific features

**Cons:**
- Monthly cost
- Smaller audience reach

**Setup:**
1. Sign up for Vimeo Live plan
2. Configure streaming settings
3. Use OBS Studio or Vimeo's tools
4. Embed on website

## 🔧 Technical Setup

### Step 1: Install OBS Studio
1. Download from https://obsproject.com/
2. Install and configure
3. Set up scenes and sources

### Step 2: Configure Audio
1. Add audio sources (microphone, music)
2. Set up audio monitoring
3. Test audio levels

### Step 3: Configure Video
1. Add video sources (camera, slides)
2. Set up scene transitions
3. Test video quality

### Step 4: Set Up Streaming
1. Go to Settings > Stream
2. Choose your platform
3. Enter stream key
4. Test connection

## 🌐 Website Integration

### Using the LiveStream Component

The website includes a `LiveStream` component that supports multiple platforms:

```tsx
<LiveStream
  streamUrl="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
  platform="youtube"
  isLive={true}
  title="Sunday Service"
  description="Join us for worship"
  chatEnabled={true}
/>
```

### Platform-Specific Setup

#### YouTube Live
1. Get stream key from YouTube Studio
2. Configure OBS with stream key
3. Start streaming
4. Copy live video URL
5. Update `streamUrl` in component

#### Facebook Live
1. Create live video in Facebook
2. Copy embed code
3. Extract video URL
4. Update component settings

#### Vimeo Live
1. Create live event in Vimeo
2. Get stream key
3. Configure OBS
4. Use Vimeo embed URL

## 📱 Mobile Streaming

### Using Mobile Apps
- **YouTube Studio** app for YouTube Live
- **Facebook Live** for Facebook
- **Restream** app for multi-platform

### Mobile Setup Tips
- Use tripod or stabilizer
- Ensure good lighting
- Test audio quality
- Have backup internet (hotspot)

## 🎯 Best Practices

### Before Service
1. Test equipment 30 minutes before
2. Check internet connection
3. Prepare backup plans
4. Set up chat moderation

### During Service
1. Monitor stream quality
2. Engage with online audience
3. Keep chat active
4. Record for archive

### After Service
1. Save recording
2. Upload to archive
3. Share on social media
4. Update website

## 💰 Cost Breakdown

### Free Setup
- OBS Studio: $0
- YouTube Live: $0
- Basic webcam: $50-100
- Basic microphone: $50-100
- **Total: $100-200**

### Professional Setup
- Vimeo Live: $75/month
- Professional camera: $500-2000
- Audio system: $200-500
- Lighting: $100-300
- **Total: $875-2875 + $75/month**

## 🔄 Workflow Example

### Sunday Service Workflow
1. **9:00 AM**: Set up equipment
2. **9:15 AM**: Test stream
3. **9:30 AM**: Go live
4. **11:00 AM**: End stream
5. **11:30 AM**: Upload archive
6. **12:00 PM**: Share on social media

## 🆘 Troubleshooting

### Common Issues
- **Poor video quality**: Check internet speed
- **Audio problems**: Test microphone settings
- **Stream drops**: Use wired internet connection
- **Chat not working**: Check platform settings

### Backup Plans
1. Pre-recorded service
2. Audio-only stream
3. Social media updates
4. Phone tree for congregation

## 📞 Support Resources

- OBS Studio: https://obsproject.com/help
- YouTube Live: https://support.google.com/youtube/
- Facebook Live: https://www.facebook.com/help/
- Vimeo Live: https://help.vimeo.com/

## 🎉 Getting Started Checklist

- [ ] Choose streaming platform
- [ ] Purchase/borrow equipment
- [ ] Install OBS Studio
- [ ] Test setup
- [ ] Create streaming schedule
- [ ] Train volunteers
- [ ] Set up website integration
- [ ] Do dry run
- [ ] Go live!

---

**Need help?** Contact your web developer or streaming platform support for technical assistance. 