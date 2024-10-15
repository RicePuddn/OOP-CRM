package com.olivecrm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                    .addMapping("/**") // Apply CORS to all endpoints
                    .allowedOrigins(
                        "http://localhost:3000") // Allow requests from your
                                                 // frontend (Next.js)
                    .allowedMethods("GET", "POST", "PUT", "DELETE",
                                    "OPTIONS") // Specify allowed HTTP methods
                    .allowedHeaders("*")       // Allow all headers
                    .allowCredentials(true);   // Allow credentials if needed
            }
        };
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {
        http.cors()
            .and() // Enable CORS configuration
            .csrf()
            .disable() // Disable CSRF protection (use with caution)
            .authorizeRequests()
            .antMatchers("/api/send-email")
            .permitAll() // Allow POST requests to send-email endpoint
            .antMatchers("/api/public/**")
            .permitAll() // Allow public access to certain GET endpoints
            .anyRequest()
            .permitAll(); // Allow all other requests without authentication
                          // (adjust as needed)

        return http.build();
    }
}
