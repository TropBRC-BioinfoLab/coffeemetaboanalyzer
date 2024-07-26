export default function CoffeeImg({ coffee, index = 0, className = null }) {
    if (!coffee.photos?.length) {
        return ''
    }

    if (!className) {
        className = 'object-cover'
    }

    return (

        <img className={className} src={'http://localhost:4000/uploads/' + coffee.photos[index]} alt="" />

    )
}