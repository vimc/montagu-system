package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.models.*
import java.time.LocalDate
import java.time.Month
import java.time.ZoneOffset

class FakeDataRepository : Repository {
    private val generator = FakeDataGenerator()
    private val defaultYears = 1996..2069
    
    override val countries = InMemoryDataSet.new(setOf(
            Country("AFG", "Afghanistan"),
            Country("ALB", "Albania"),
            Country("AGO", "Angola"),
            Country("ARM", "Armenia"),
            Country("AZE", "Azerbaijan"),
            Country("BGD", "Bangladesh"),
            Country("BLZ", "Belize"),
            Country("BEN", "Benin"),
            Country("BTN", "Bhutan"),
            Country("BOL", "Bolivia"),
            Country("BIH", "Bosnia and Herzegovina"),
            Country("BFA", "Burkina Faso"),
            Country("BDI", "Burundi"),
            Country("KHM", "Cambodia"),
            Country("CMR", "Cameroon"),
            Country("CPV", "Cape Verde"),
            Country("CAF", "Central African Republic"),
            Country("TCD", "Chad"),
            Country("CHN", "China"),
            Country("COM", "Comoros"),
            Country("COD", "Congo, DR"),
            Country("COG", "Congo, Rep"),
            Country("CIV", "Cote d'Ivoire"),
            Country("CUB", "Cuba"),
            Country("DJI", "Djibouti"),
            Country("EGY", "Egypt"),
            Country("SLV", "El Salvador"),
            Country("ERI", "Eritrea"),
            Country("ETH", "Ethiopia"),
            Country("FJI", "Fiji"),
            Country("GMB", "Gambia"),
            Country("GEO", "Georgia"),
            Country("GHA", "Ghana"),
            Country("GTM", "Guatemala"),
            Country("GIN", "Guinea"),
            Country("GNB", "Guinea-Bissau"),
            Country("GUY", "Guyana"),
            Country("HTI", "Haiti"),
            Country("HND", "Honduras"),
            Country("IND", "India"),
            Country("IDN", "Indonesia"),
            Country("IRQ", "Iraq"),
            Country("KEN", "Kenya"),
            Country("KIR", "Kiribati"),
            Country("PRK", "Korea, DPR"),
            Country("XK", "Kosovo"),
            Country("KGZ", "Kyrgyzstan"),
            Country("LAO", "Lao PDR"),
            Country("LSO", "Lesotho"),
            Country("LBR", "Liberia"),
            Country("MDG", "Madagascar"),
            Country("MWI", "Malawi"),
            Country("MLI", "Mali"),
            Country("MHL", "Marshall Islands"),
            Country("MRT", "Mauritania"),
            Country("FSM", "Micronesia"),
            Country("MDA", "Moldova"),
            Country("MNG", "Mongolia"),
            Country("MAR", "Morocco"),
            Country("MOZ", "Mozambique"),
            Country("MMR", "Myanmar"),
            Country("NPL", "Nepal"),
            Country("NIC", "Nicaragua"),
            Country("NER", "Niger"),
            Country("NGA", "Nigeria"),
            Country("PAK", "Pakistan"),
            Country("PNG", "Papua New Guinea"),
            Country("PRY", "Paraguay"),
            Country("PHL", "Philippines"),
            Country("RWA", "Rwanda"),
            Country("WSM", "Samoa"),
            Country("STP", "Sao Tome e Principe"),
            Country("SEN", "Senegal"),
            Country("SLE", "Sierra Leone"),
            Country("SLB", "Solomon Islands"),
            Country("SOM", "Somalia"),
            Country("LKA", "Sri Lanka"),
            Country("SDN", "Sudan: North"),
            Country("SSD", "Sudan: South"),
            Country("SWZ", "Swaziland"),
            Country("SYR", "Syria"),
            Country("TJK", "Tajikistan"),
            Country("TZA", "Tanzania"),
            Country("TLS", "Timor-Leste"),
            Country("TGO", "Togo"),
            Country("TON", "Tonga"),
            Country("TKM", "Turkmenistan"),
            Country("TUV", "Tuvalu"),
            Country("UGA", "Uganda"),
            Country("UKR", "Ukraine"),
            Country("UZB", "Uzbekistan"),
            Country("VUT", "Vanuatu"),
            Country("VNM", "Vietnam"),
            Country("PSE", "West Bank and Gaza"),
            Country("YEM", "Yemen"),
            Country("ZMB", "Zambia"),
            Country("ZWE", "Zimbabwe")
    ))

    override val scenarios = InMemoryDataSet.new(listOf(
        Scenario("menA-novacc", "Meningitis A, No vaccination", "none", "MenA", "MenA", "n/a", countries.all(), defaultYears),
        Scenario("menA-routine-nogavi", "Meningitis A, Routine, No GAVI support", "nogavi", "MenA", "MenA", "routine", countries.all(), defaultYears),
        Scenario("menA-routine-gavi", "Meningitis A, Routine, With GAVI support", "gavi", "MenA", "MenA", "routine", countries.all(), defaultYears),
        Scenario("menA-campaign-nogavi", "Meningitis A, Campaign, No GAVI support", "nogavi", "MenA", "MenA", "campaign", countries.all(), defaultYears),
        Scenario("menA-campaign-gavi", "Meningitis A, Campaign, With GAVI support", "gavi", "MenA", "MenA", "campaign", countries.all(), defaultYears),
        Scenario("yf-novacc", "Yellow Fever, No vaccination", "none", "YF", "YF", "n/a", countries.all(), defaultYears),
        Scenario("yf-routine-nogavi", "Yellow Fever, Routine, No GAVI support", "nogavi", "YF", "YF", "routine", countries.all(), defaultYears),
        Scenario("yf-routine-gavi", "Yellow Fever, Routine, With GAVI support", "gavi", "YF", "YF", "routine", countries.all(), defaultYears),
        Scenario("yf-campaign-reactive-nogavi", "Yellow Fever, Reactive Campaign, No GAVI support", "nogavi", "YF", "YF", "campaign", countries.all(), defaultYears),
        Scenario("yf-campaign-reactive-gavi", "Yellow Fever, Reactive Campaign, With GAVI support", "gavi", "YF", "YF", "campaign", countries.all(), defaultYears),
        Scenario("yf-campaign-preventative-nogavi", "Yellow Fever, Preventative Campaign, No GAVI support", "nogavi", "YF", "YF", "campaign", countries.all(), defaultYears),
        Scenario("yf-campaign-preventative-gavi", "Yellow Fever, Preventative Campaign, With GAVI support", "gavi", "YF", "YF", "campaign", countries.all(), defaultYears)
    ))
    private val menAScenario = scenarios.get("menA-novacc")
    private val yfScenario = scenarios.get("yf-routine-gavi")

    override val modellingGroups = InMemoryDataSet.new(listOf(
            ModellingGroup("pennsylvania-state", "Pennsylvania State University", emptyList()),
            ModellingGroup("harvard-public-health", "Harvard University School of Public Health", emptyList()),
            ModellingGroup("oxford-vietnam", "Oxford University Clinical Research Unit (Vietnam)", emptyList()),
            ModellingGroup("john-hopkins", "Johns Hopkins University", emptyList()),
            ModellingGroup("cda", "CDA (Center for Disease Analysis)", emptyList()),
            ModellingGroup("cambridge", "University of Cambridge", emptyList()),
            ModellingGroup("london-school", "London School of Hygiene & Tropical Medicine", emptyList()),
            ModellingGroup("phe", "Public Health England", emptyList()),
            ModellingGroup("imperial", "Imperial College London", listOf(
                    ImpactEstimate(1, menAScenario, "SuperModel 1.0",
                            date(2017, Month.JANUARY, 15),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(2, menAScenario, "SuperModel 1.1",
                            date(2017, Month.JANUARY, 20),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(3, menAScenario, "SuperModel 1.1",
                            date(2017, Month.JANUARY, 21),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(4, yfScenario, "YF Model 3.14",
                            date(2017, Month.JANUARY, 2),
                            generator.generateOutcomes(yfScenario)),
                    ImpactEstimate(5, yfScenario, "YF Model 3.14",
                            date(2017, Month.JANUARY, 3),
                            generator.generateOutcomes(yfScenario))
            ))
    ))

    private fun date(year: Year, month: Month, day: Int) = LocalDate.of(year, month, day)
            .atStartOfDay()
            .plus(generator.randomTimeOffset())
            .toInstant(ZoneOffset.UTC)

}