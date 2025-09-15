package uk.ac.imperial.vimc.demo.app.filters

/**
 * A Mapper is a way of getting an "equivalent" value from two different kinds of objects.
 * For example, a way of getting a person's name from both a Passport object and a BirthCertificate object
 */
class Mapper<in A, in B, out Value>(val getA: (A) -> Value,
                                    val getB: (B) -> Value)