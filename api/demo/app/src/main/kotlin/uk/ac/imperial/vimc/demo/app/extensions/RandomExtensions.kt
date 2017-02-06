package uk.ac.imperial.vimc.demo.app.extensions

fun String.toSeed(): Long {
    return this.toByteArray().take(8).withIndex()
            .map { (it.value.toLong() and 0xFFL).shl(8 * it.index) }
            .sum()
}