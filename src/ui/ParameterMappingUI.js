/**
 * A Paul Phillips Manifestation
 * ParameterMappingUI - Live parameter mapping control panel
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

export class ParameterMappingUI {
    constructor(touchpadController) {
        this.touchpadController = touchpadController;
        this.isExpanded = false;
        this.createUI();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'parameter-mapping-ui';
        container.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: rgba(0, 20, 40, 0.95);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            font-family: 'Orbitron', monospace;
            color: #00ffff;
            max-width: 320px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            transition: all 0.3s;
        `;

        // Header with toggle
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
            user-select: none;
        `;

        const title = document.createElement('div');
        title.textContent = 'TOUCHPAD MAPPING';
        title.style.cssText = `
            font-size: 14px;
            font-weight: bold;
        `;

        const toggleIcon = document.createElement('div');
        toggleIcon.id = 'mapping-toggle-icon';
        toggleIcon.textContent = '▼';
        toggleIcon.style.cssText = `
            font-size: 12px;
            transition: transform 0.3s;
        `;

        header.appendChild(title);
        header.appendChild(toggleIcon);
        header.addEventListener('click', () => this.toggleExpanded());

        container.appendChild(header);

        // Content container
        const content = document.createElement('div');
        content.id = 'mapping-content';
        content.style.cssText = `
            max-height: 400px;
            overflow-y: auto;
            border-top: 1px solid #00ffff;
            padding-top: 10px;
        `;

        // Primary touchpad mappings
        content.appendChild(this.createTouchpadSection('Primary (Overlay)', 'primary'));

        // Divider
        const divider = document.createElement('div');
        divider.style.cssText = `
            height: 1px;
            background: rgba(0, 255, 255, 0.3);
            margin: 15px 0;
        `;
        content.appendChild(divider);

        // Secondary touchpad mappings
        content.appendChild(this.createTouchpadSection('Secondary (UI)', 'secondary'));

        container.appendChild(content);
        document.body.appendChild(container);

        // Start collapsed
        this.toggleExpanded();
    }

    createTouchpadSection(sectionTitle, touchpadType) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 15px;';

        const sectionLabel = document.createElement('div');
        sectionLabel.textContent = sectionTitle;
        sectionLabel.style.cssText = `
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #ff00ff;
        `;
        section.appendChild(sectionLabel);

        // Enable/Disable toggle
        const enableToggle = this.createToggle(
            `${touchpadType}-enable`,
            'Enabled',
            true,
            (checked) => {
                this.touchpadController.toggleTouchpad(touchpadType, checked);
            }
        );
        section.appendChild(enableToggle);

        // X axis mapping
        const xMapping = this.createMappingDropdown(
            `${touchpadType}-x`,
            'X Axis →',
            touchpadType === 'primary' ? 'gridDensity' : 'hue',
            (value) => {
                this.touchpadController.updateMapping(touchpadType, 'x', value);
            }
        );
        section.appendChild(xMapping);

        // Y axis mapping
        const yMapping = this.createMappingDropdown(
            `${touchpadType}-y`,
            'Y Axis ↑',
            touchpadType === 'primary' ? 'morphFactor' : 'saturation',
            (value) => {
                this.touchpadController.updateMapping(touchpadType, 'y', value);
            }
        );
        section.appendChild(yMapping);

        return section;
    }

    createToggle(id, label, defaultChecked, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            align-items: center;
            margin: 8px 0;
            justify-content: space-between;
        `;

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = id;
        labelElem.style.cssText = `
            font-size: 11px;
            cursor: pointer;
        `;

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = id;
        toggle.checked = defaultChecked;
        toggle.style.cssText = `
            cursor: pointer;
            width: 16px;
            height: 16px;
        `;

        toggle.addEventListener('change', (e) => onChange(e.target.checked));

        container.appendChild(labelElem);
        container.appendChild(toggle);

        return container;
    }

    createMappingDropdown(id, label, defaultValue, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 8px 0;
        `;

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = id;
        labelElem.style.cssText = `
            font-size: 10px;
            display: block;
            margin-bottom: 3px;
        `;

        const select = document.createElement('select');
        select.id = id;
        select.style.cssText = `
            width: 100%;
            padding: 5px;
            background: rgba(0, 0, 0, 0.7);
            color: #00ffff;
            border: 1px solid #00ffff;
            border-radius: 3px;
            font-family: 'Orbitron', monospace;
            font-size: 10px;
            cursor: pointer;
        `;

        // Add all available parameters as options
        this.touchpadController.availableParams.forEach(param => {
            const option = document.createElement('option');
            option.value = param;
            option.textContent = param;
            if (param === defaultValue) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => onChange(e.target.value));

        container.appendChild(labelElem);
        container.appendChild(select);

        return container;
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
        const content = document.getElementById('mapping-content');
        const icon = document.getElementById('mapping-toggle-icon');

        if (this.isExpanded) {
            content.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        }
    }
}
