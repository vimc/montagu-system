package uk.ac.imperial.vimc.demo.app.models

data class Scenario(val id: String,
                    val description: String,
                    val vaccinationLevel: String,
                    val disease: String,
                    val vaccine: String,
                    val scenarioType: String)

object StaticScenarios {
    val all = listOf(
            Scenario("menA-novacc", "Meningitis A, No vaccination", "none", "MenA", "MenA", "n/a"),
            Scenario("menA-routine-nogavi", "Meningitis A, Routine, No GAVI support", "nogavi", "MenA", "MenA", "routine"),
            Scenario("menA-routine-gavi", "Meningitis A, Routine, With GAVI support", "gavi", "MenA", "MenA", "routine"),
            Scenario("menA-campaign-nogavi", "Meningitis A, Campaign, No GAVI support", "nogavi", "MenA", "MenA", "campaign"),
            Scenario("menA-campaign-gavi", "Meningitis A, Campaign, With GAVI support", "gavi", "MenA", "MenA", "campaign"),
            Scenario("yf-novacc", "Yellow Fever, No vaccination", "none", "YF", "YF", "n/a"),
            Scenario("yf-routine-nogavi", "Yellow Fever, Routine, No GAVI support", "nogavi", "YF", "YF", "routine"),
            Scenario("yf-routine-gavi", "Yellow Fever, Routine, With GAVI support", "gavi", "YF", "YF", "routine"),
            Scenario("yf-campaign-reactive-nogavi", "Yellow Fever, Reactive Campaign, No GAVI support", "nogavi", "YF", "YF", "campaign"),
            Scenario("yf-campaign-reactive-gavi", "Yellow Fever, Reactive Campaign, With GAVI support", "gavi", "YF", "YF", "campaign"),
            Scenario("yf-campaign-preventative-nogavi", "Yellow Fever, Preventative Campaign, No GAVI support", "nogavi", "YF", "YF", "campaign"),
            Scenario("yf-campaign-preventative-gavi", "Yellow Fever, Preventative Campaign, With GAVI support", "gavi", "YF", "YF", "campaign")
    )
}