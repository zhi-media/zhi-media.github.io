/**
 * 主题管理器 - 统一管理主题初始化和切换
 */
class ThemeManager {
    // 主题常量
    static THEME_LIGHT = '1';
    static THEME_DARK = '0';
    static STORAGE_KEY = 'color-scheme';

    // 动画配置常量
    static ANIMATION_DURATION = 300;  // 固定动画时长(毫秒)

    /**
     * 应用主题到 DOM
     * @param {string} scheme - 主题值 ('0' = Dark, '1' = Light)
     * @param {boolean} animated - 是否使用动画,默认 false
     */
    static applyTheme(scheme, animated = false) {
        const isLight = scheme === this.THEME_LIGHT;

        const ltLinks = document.querySelectorAll('link[class=css-lt]');
        const dkLinks = document.querySelectorAll('link[class=css-dk]');

        if (animated) {
            // 有动画效果的切换
            this._applyThemeWithTransition(ltLinks, dkLinks, isLight);
        } else {
            // 无动画效果的切换(立即切换)
            this._applyThemeImmediate(ltLinks, dkLinks, isLight);
        }
    }

    /**
     * 立即应用主题(无动画)
     * @private
     */
    static _applyThemeImmediate(ltLinks, dkLinks, isLight) {
        ltLinks.forEach(link => {
            link.media = isLight ? 'all' : 'not screen';
        });

        dkLinks.forEach(link => {
            link.media = isLight ? 'not screen' : 'all';
        });
    }

    /**
     * 带过渡动画的主题切换
     * 使用固定的动画时长确保最佳视觉效果
     * @private
     */
    static _applyThemeWithTransition(ltLinks, dkLinks, isLight) {
        const root = document.documentElement;
        const duration = this.ANIMATION_DURATION;

        // 添加 transition 属性实现真正的渐变
        root.style.transition = `opacity ${duration}ms ease-in-out`;

        // 第一阶段: 淡出到 0
        root.style.opacity = '0';

        // 在淡出动画中点切换主题
        setTimeout(() => {
            this._applyThemeImmediate(ltLinks, dkLinks, isLight);

            // 第二阶段: 淡入到 1
            // 使用 requestAnimationFrame 确保 DOM 更新后再淡入
            requestAnimationFrame(() => {
                root.style.opacity = '1';
            });

            // 动画完成后清理样式
            setTimeout(() => {
                root.style.transition = '';
                root.style.opacity = '';
            }, duration);
        }, duration / 2);
    }

    /**
     * 初始化主题 - 在页面加载时调用
     * 从 localStorage 读取保存的主题并应用(无动画)
     */
    static initialize() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);

        if (savedTheme) {
            console.log('ThemeManager: Initializing with saved theme =', savedTheme);
            // 初始化时不使用动画
            this.applyTheme(savedTheme, false);
        } else {
            console.log('ThemeManager: No saved theme found, using default');
        }
    }

    /**
     * 设置主题 - 由 C# 通过 JSInterop 调用
     * @param {string} scheme - 主题值 ('0' = Dark, '1' = Light)
     * @param {boolean} animated - 是否使用动画,默认 true
     */
    static setScheme(scheme, animated = true) {
        console.log('ThemeManager: Setting theme to', scheme, 'with animation:', animated);

        // 保存到 localStorage
        localStorage.setItem(this.STORAGE_KEY, scheme);

        // 应用主题
        this.applyTheme(scheme, animated);
    }

    /**
     * 获取当前主题
     * @returns {string|null} 当前主题值
     */
    static getCurrentScheme() {
        return localStorage.getItem(this.STORAGE_KEY);
    }
}

// 自动初始化
ThemeManager.initialize();
