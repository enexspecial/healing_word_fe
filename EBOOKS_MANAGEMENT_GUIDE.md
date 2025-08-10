# E-books Management Guide for Healing Word Church

## 📚 Overview

This guide will help you manage the E-books section of your church website, including how to add new resources, organize content, and maintain the library.

## 🎯 What You Can Share

### Types of Resources
- **Sermon Transcripts** - Full sermon texts with scripture references
- **Bible Studies** - In-depth study guides with discussion questions
- **Devotionals** - Daily or weekly spiritual reflections
- **Prayer Guides** - Prayer resources and intercession materials
- **Youth Resources** - Age-appropriate materials for young people
- **Family Resources** - Materials for families to use together

### File Formats
- **PDF** - Most common, works on all devices
- **EPUB** - For e-readers and mobile devices
- **DOCX** - For editable documents
- **TXT** - Simple text files

## 📁 File Organization

### Directory Structure
```
public/
├── ebooks/
│   ├── sermons/
│   ├── bible-studies/
│   ├── devotionals/
│   ├── prayer/
│   ├── youth/
│   └── family/
└── images/
    └── ebooks/
        ├── covers/
        └── thumbnails/
```

### Naming Convention
- Use descriptive, SEO-friendly names
- Include date and author when relevant
- Example: `walking-in-faith-devotional-july-2024.pdf`

## 🔧 Adding New E-books

### Step 1: Prepare Your Content
1. **Create the document** in your preferred format
2. **Design a cover image** (recommended size: 400x600px)
3. **Write a compelling description** (2-3 sentences)
4. **Determine the category** and tags

### Step 2: Upload Files
1. **Upload the PDF** to the appropriate folder in `public/ebooks/`
2. **Upload the cover image** to `public/images/ebooks/covers/`
3. **Create a preview version** (first few pages) if desired

### Step 3: Update the Website
1. **Add the e-book data** to the `sampleEbooks` array in `/src/app/ebooks/page.tsx`
2. **Test the download link** to ensure it works
3. **Update the stats** (total count, downloads, etc.)

### Example E-book Entry
```javascript
{
  id: '7',
  title: 'New E-book Title',
  author: 'Author Name',
  description: 'Brief description of the content and what readers will learn.',
  coverImage: '/images/ebooks/covers/new-ebook-cover.jpg',
  category: 'devotional',
  fileSize: '2.1 MB',
  pages: 35,
  publishDate: 'August 2024',
  downloadUrl: '/ebooks/devotionals/new-ebook.pdf',
  previewUrl: '/ebooks/devotionals/new-ebook-preview.pdf',
  isNew: true,
  isPopular: false
}
```

## 🎨 Creating Cover Images

### Design Guidelines
- **Size**: 400x600 pixels (3:4 ratio)
- **Format**: JPG or PNG
- **Style**: Professional, church-appropriate
- **Elements**: Title, author, church logo
- **Colors**: Match your church branding

### Free Design Tools
- **Canva** - Easy-to-use online design tool
- **GIMP** - Free Photoshop alternative
- **Pixlr** - Online photo editor
- **Google Slides** - Simple design option

### Cover Template Elements
1. **Church logo** (top or bottom)
2. **Title** (large, readable font)
3. **Author name** (smaller, below title)
4. **Category indicator** (color-coded)
5. **Background** (subtle, professional)

## 📊 Managing Categories

### Current Categories
- **Sermons** - Blue theme
- **Bible Studies** - Green theme
- **Devotionals** - Purple theme
- **Prayer** - Red theme
- **Youth** - Yellow theme
- **Family** - Pink theme

### Adding New Categories
1. **Update the interface** in `EbookCard.tsx`
2. **Add color scheme** to `getCategoryColor()`
3. **Add label** to `getCategoryLabel()`
4. **Update the filter** in the main page

## 🔍 Search and Filter Features

### Search Functionality
- Searches title, author, and description
- Case-insensitive
- Real-time results

### Filter Options
- **Category filter** - Browse by type
- **Sort options**:
  - Newest first
  - Oldest first
  - Most popular
  - Alphabetical

### Adding New Filters
1. **Add filter state** to the component
2. **Update filter logic** in the filtering function
3. **Add UI elements** for the new filter

## 📈 Analytics and Tracking

### What to Track
- **Download counts** - Most popular resources
- **Search terms** - What people are looking for
- **Category popularity** - Which types are most used
- **User engagement** - Time spent on page

### Implementation Options
- **Google Analytics** - Track page views and downloads
- **Custom tracking** - Database to store download counts
- **Server logs** - Monitor file access

## 🎯 Best Practices

### Content Quality
- **Proofread everything** before publishing
- **Use consistent formatting** across all resources
- **Include scripture references** where applicable
- **Add discussion questions** for group use

### File Management
- **Keep file sizes reasonable** (under 10MB)
- **Use descriptive filenames**
- **Organize by category** in folders
- **Backup all files** regularly

### User Experience
- **Provide clear descriptions** of content
- **Include page counts** and file sizes
- **Offer preview options** when possible
- **Make downloads easy** with clear buttons

## 🚀 Advanced Features

### Newsletter Integration
- **Email notifications** when new resources are added
- **Weekly digest** of new content
- **Category-specific newsletters**

### Social Sharing
- **Share buttons** for each resource
- **Social media previews** with cover images
- **Embed codes** for other websites

### User Accounts
- **Download history** for registered users
- **Favorites list** for saved resources
- **Reading progress** tracking

## 🛠️ Technical Maintenance

### Regular Tasks
- **Update download counts** monthly
- **Check broken links** weekly
- **Optimize images** for faster loading
- **Backup content** regularly

### Performance Optimization
- **Compress PDFs** to reduce file sizes
- **Optimize cover images** for web
- **Use CDN** for faster downloads
- **Implement caching** for better performance

## 📞 Support and Troubleshooting

### Common Issues
- **Broken download links** - Check file paths
- **Missing cover images** - Verify image URLs
- **Large file sizes** - Compress PDFs
- **Search not working** - Check filter logic

### Getting Help
- **Web developer** - For technical issues
- **Content team** - For content management
- **IT support** - For server/file issues

## 🎉 Success Metrics

### Key Performance Indicators
- **Total downloads** per month
- **Most popular resources**
- **User engagement** time
- **Return visitors** to resources page

### Goals to Set
- **Monthly downloads** target
- **New resources** per month
- **User feedback** collection
- **Content quality** improvements

---

**Need help?** Contact your web developer for technical assistance or your content team for content management questions. 