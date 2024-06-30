use rand::Rng;
use rand::distributions::Alphanumeric;

pub fn generate_random_text(length: usize) -> String {
    let mut rng = rand::thread_rng();
    (0..length)
        .map(|_| rng.sample(Alphanumeric) as char)
        .collect()
}