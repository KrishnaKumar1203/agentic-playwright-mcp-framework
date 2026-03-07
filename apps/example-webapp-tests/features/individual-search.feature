# Feature: Individual Search
# Description: Test search functionality for individual records

  Scenario: Search for existing individual
    Given User is on the search page
    When User searches for "John Doe"
    Then Search results should display at least 1 result
    And First result should contain "John Doe"

  Scenario: Search with no results
    Given User is on the search page
    When User searches for "NonExistent"
    Then No results message should be displayed

  Scenario: Search with special characters
    Given User is on the search page
    When User searches for "test@example.com"
    Then Search results should filter correctly
