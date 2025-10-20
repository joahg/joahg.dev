# joahg.dev

Personal website and blog built with Jekyll and hosted on GitHub Pages.

## Local Development (Optional)

Local testing is optional - GitHub Pages will automatically build your site when you push changes.

If you want to test locally:

```bash
# Install dependencies
bundle config set --local path 'vendor/bundle'
bundle install

# Run Jekyll server
bundle exec jekyll serve
```

Visit http://localhost:4000 to see your site.

**Note:** If you encounter native extension compilation errors, you can skip local testing and push directly to GitHub - the site will build automatically.

## Adding a Blog Post

1. Create a new file in the `_posts` directory with the naming format:
   ```
   YYYY-MM-DD-your-post-title.md
   ```
   Example: `2025-10-19-my-first-post.md`

2. Add front matter at the top of the file:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: 2025-10-19 12:00:00 -0500
   ---
   ```

3. Write your content using Markdown below the front matter.

4. See `_posts/YYYY-MM-DD-your-post-title.md` for a template with examples.

## Site Structure

- `index.html` - Main homepage featuring profile and up to 3 recent posts
- `_layouts/` - Page layouts
  - `default.html` - Base layout
  - `post.html` - Blog post layout
- `_posts/` - Blog posts (Markdown files)
- `assets/css/style.css` - Site styles
- `_config.yml` - Jekyll configuration

## Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch.

Custom domain: joahg.dev (configured via CNAME file)
