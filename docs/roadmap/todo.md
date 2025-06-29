# 📝 Project Vista - TODO

## Auto-Select Articles Feature Improvements

### High Priority

- **Replace auto-select button behavior**: Instead of greying out the "Auto Select" button after first use, replace it with a "redo" symbol (↻ or refresh icon) that allows users to regenerate the auto-selected articles with a new different batch
  - This gives users flexibility to try different AI-generated suggestions
  - Should replace the previously auto-inserted articles, not add to them
  - Keep the same visual indicators for newly auto-generated articles

### Medium Priority

- **Advanced auto-populate options**: Add an advanced/expandable section to the auto-select feature that allows users to:
  - Control the number of articles to auto-populate (default: 5, range: 3-10)
  - Possibly add topic focus or difficulty level preferences
  - Option to include/exclude certain types of articles (biographical, historical, scientific, etc.)

### Future Considerations

- **Backend Implementation**: Replace the current mock random strings with actual AI-powered article suggestions based on the track title
- **Learning from User Behavior**: Track which auto-generated articles users keep vs. remove to improve future suggestions
- **Contextual Suggestions**: Consider user's past tracks and interests when generating article suggestions
