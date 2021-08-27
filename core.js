// Template view
export default function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()), 
        [first]
    )
    .filter(x => x && x !== true || x === 0) // Lọc để lấy ra các thành phần là truthy
    .join('');
}

// Tạo store
export function createStore(reducer) {
    let state = reducer() // Dữ liệu trong store
    const roots = new Map() 

    function render() {
        for(const[root, component] of roots) {
            const output = component() 
            root.innerHTML = output
        }
    }

    return {
        // Nhận view và đẩy ra
        attach(component, root) {
            roots.set(root, component) // Set dữ liệu cho roots || key: root, value: component
            render()
        },
        // Kết nối store và view
        connect(selector = state => state) {
            return component => (props, ...agrs) => component(Object.assign({}, props, selector(state), ...agrs))
        },

        dispatch(action, ...args) {
            state = reducer(state, action, args) // Update store
            render()
        }
    }
}