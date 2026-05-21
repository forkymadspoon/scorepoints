<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Score Points. PostHog is now initialized in `src/main.tsx` with the `PostHogProvider` wrapping the entire app, enabling autocapture and session recording out of the box. Eleven custom events are tracked across four component files, covering the full lifecycle of a child's point journey — from earning and deducting points through to goal achievement and reward redemption — as well as parent management actions like settings changes, profile switching, and preset customisation.

| Event | Description | File |
|---|---|---|
| `points_earned` | A child earns points when a good behaviour action is applied (preset or custom) | `src/app/components/ChildDashboard.tsx` |
| `points_deducted` | A child loses points when a bad behaviour action is applied (preset or custom) | `src/app/components/ChildDashboard.tsx` |
| `goal_reached` | A child's points reach or exceed their reward goal, triggering the celebration | `src/app/components/ChildDashboard.tsx` |
| `reward_cashed_in` | Parent cashes in the reward and resets points back to zero | `src/app/components/ChildDashboard.tsx` |
| `points_reset` | Points are manually reset to zero via the Reset Points button in settings | `src/app/components/ChildDashboard.tsx` |
| `transaction_undone` | A transaction is undone from the history modal, reversing the point change | `src/app/components/ChildDashboard.tsx` |
| `goal_settings_saved` | Parent saves updated goal target, reward text, and/or reward type | `src/app/components/ChildDashboard.tsx` |
| `child_profile_added` | A new child profile is created | `src/app/components/ChildSelectorModal.tsx` |
| `child_profile_switched` | The active child profile is switched to a different child | `src/app/components/ChildSelectorModal.tsx` |
| `action_preset_added` | A new action preset is saved to the good or bad behaviour list | `src/app/components/ActionModal.tsx` |
| `action_preset_deleted` | An action preset is deleted from the good or bad behaviour list | `src/app/components/ActionModal.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1611151)
- [Points Activity Over Time](/insights/ky5E4JXa) — daily trend of points earned vs deducted
- [Reward Conversion Funnel](/insights/piVzuoLD) — conversion from earning points → goal reached → reward cashed in
- [Total Goals Reached](/insights/Ef9WAOiI) — total goal completions (last 30 days)
- [Top Point-Earning Actions](/insights/oRR5ehLd) — which behaviours are rewarded most often
- [Points Reset & Undo Activity](/insights/SMQiwnWS) — tracks corrections and engagement changes

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
