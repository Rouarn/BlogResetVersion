export const BLOG_NAV_ITEMS: App.Blog.NavItem[] = [
  { key: 'home', icon: 'heroicons:home', label: '首页', path: '/home' },
  { key: 'archive', icon: 'heroicons:clock', label: '归档', path: '/archive' },
  { key: 'tags', icon: 'heroicons:tag', label: '标签', path: '/tags' },
  { key: 'about', icon: 'heroicons:user', label: '关于', path: '/about' },
]

export const BLOG_SOCIAL_LINKS: App.Blog.SocialLink[] = [
  {
    key: 'github',
    label: 'GitHub',
    icon: 'simple-icons:github',
    link: '#',
    class: 'hover:bg-slate-800 hover:text-white',
  },
  {
    key: 'twitter',
    label: 'Twitter',
    icon: 'simple-icons:twitter',
    link: '#',
    class: 'hover:bg-sky-500 hover:text-white',
  },
  {
    key: 'wechat',
    label: 'WeChat',
    icon: 'simple-icons:wechat',
    link: '#',
    class: 'hover:bg-emerald-500 hover:text-white',
  },
  {
    key: 'email',
    label: 'Email',
    icon: 'heroicons:envelope',
    link: 'mailto:example@example.com',
    class: 'hover:bg-red-500 hover:text-white',
  },
]
