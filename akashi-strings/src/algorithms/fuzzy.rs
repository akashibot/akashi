use crate::algorithms::jaro::jaro_winkler_distance;

/// Performs a fuzzy search on a list of strings.
pub fn fuzzy_search<'a>(query: &str, choices: &'a [&str], threshold: f64) -> Vec<&'a str> {
	choices
		.iter()
		.filter(|&&choice| jaro_winkler_distance(query, choice) >= threshold)
		.copied()
		.collect()
}
