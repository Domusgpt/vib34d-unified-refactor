/**
 * A Paul Phillips Manifestation
 * MobileOptimizedUI - Collapsible, mobile-friendly UI manager
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

export class MobileOptimizedUI {
    constructor() {
        this.isMobile = this.detectMobile();
        this.uiVisible = !this.isMobile; // Hide by default on mobile
        this.createToggleButton();
        this.createContainer();
        this.setupStyles();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth < 768;
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.id = 'ui-toggle-btn';
        button.innerHTML = this.uiVisible ? '✕' : '☰';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            background: rgba(0, 255, 255, 0.9);
            color: #000;
            border: 2px solid #00ffff;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;

        button.addEventListener('click', () => this.toggleUI());
        document.body.appendChild(button);
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'mobile-ui-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            right: ${this.uiVisible ? '0' : '-100%'};
            width: ${this.isMobile ? '100%' : '400px'};
            height: 100%;
            background: rgba(0, 10, 20, 0.98);
            border-left: 2px solid #00ffff;
            z-index: 9999;
            overflow-y: auto;
            transition: right 0.3s ease-in-out;
            padding: 70px 20px 20px 20px;
        `;

        document.body.appendChild(container);
        this.container = container;
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide original UI elements and put them in our container */
            #mobile-ui-container #performance-mode-selector,
            #mobile-ui-container #reactivity-format-switcher,
            #mobile-ui-container #parameter-mapping-ui,
            #mobile-ui-container #pattern-trigger-ui,
            #mobile-ui-container #secondary-touchpad-container {
                position: static !important;
                width: 100% !important;
                max-width: 100% !important;
                margin-bottom: 20px !important;
                right: auto !important;
                left: auto !important;
                top: auto !important;
                bottom: auto !important;
                display: block !important;
            }

            /* Mobile-specific adjustments */
            @media (max-width: 768px) {
                .controls-panel {
                    display: none !important;
                }

                #secondary-touchpad-container {
                    width: 100% !important;
                    height: 250px !important;
                }

                #performance-mode-selector {
                    flex-direction: column !important;
                    gap: 10px !important;
                }

                #performance-mode-selector button {
                    width: 100% !important;
                }
            }

            /* Scrollbar styling */
            #mobile-ui-container::-webkit-scrollbar {
                width: 8px;
            }

            #mobile-ui-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
            }

            #mobile-ui-container::-webkit-scrollbar-thumb {
                background: rgba(0, 255, 255, 0.5);
                border-radius: 4px;
            }

            #mobile-ui-container::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 255, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    toggleUI() {
        this.uiVisible = !this.uiVisible;
        const button = document.getElementById('ui-toggle-btn');
        const container = this.container;

        if (this.uiVisible) {
            container.style.right = '0';
            button.innerHTML = '✕';
            button.style.background = 'rgba(255, 0, 255, 0.9)';
            button.style.borderColor = '#ff00ff';
        } else {
            container.style.right = '-100%';
            button.innerHTML = '☰';
            button.style.background = 'rgba(0, 255, 255, 0.9)';
            button.style.borderColor = '#00ffff';
        }
    }

    moveElementToContainer(elementId) {
        const element = document.getElementById(elementId);
        if (element && this.container) {
            this.container.appendChild(element);
        }
    }

    organizeUI() {
        // Move all UI elements into the mobile container
        setTimeout(() => {
            this.moveElementToContainer('performance-mode-selector');
            this.moveElementToContainer('reactivity-format-switcher');
            this.moveElementToContainer('parameter-mapping-ui');
            this.moveElementToContainer('pattern-trigger-ui');
            this.moveElementToContainer('secondary-touchpad-container');
        }, 500);
    }
}
