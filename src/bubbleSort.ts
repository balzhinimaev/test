function bubbleSort (array: number[]): number[] {
    
    const n = array.length

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]]
            }

        }

        console.log(`Step ${i+1}: ${array}`)
    }
    return array
}

export { bubbleSort }

// bubbleSort([1, 3, 5, 4, 2])