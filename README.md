# compass-education

A package to interact with [Compass Education](https://compass.education), a popular school management system in Australia.

## ❗ Disclaimer ❗

This package is unofficial, and is not affiliated with Compass Education in any way. It is not endorsed by Compass Education, and may break at any time. It also does not support all schools. Use at your own risk.

## Installation

Requires Node 18.0.0 or higher for native fetch support.

Please follow [Puppeteer's system requirements](https://pptr.dev/guides/system-requirements).

```bash
# npm users
npm install compass-education
# yarn users
yarn add compass-education
# pnpm users
pnpm add compass-education
# bun users
bun add compass-education
```

## Example 
```ts
import { CompassClient } from 'compass-education';

// Create a new client instance:
const compass = new CompassClient("xxx.compass.education");

(async () => {
  // Log into compass:
  await compass
    .login({
      username: "username",
      password: "password"
    });

  // Fetch my timetable for today:
  const todayTimetable = await compass.getCalendarEvents();
  console.log(todayTimetable);

  // Fetch my timetable for a specific day:
  const specificDayTimetable = await compass.getCalendarEvents({
    startDate: "2022-01-01", // Can also be a Date object.
    endDate: "2022-01-01" // Can also be a Date object.
  });
  console.log(specificDayTimetable);

  // What is my name?
  const userDetails = await compass.getUserDetails();
  console.log(userDetails.fullName);

  // Terminate the session:
  await compass.logout();
})();

```

<details open>
  <summary>Example output of timetable for above example</summary>

  ```ts
  [
    {
      subjectLongName: 'Science',
      subjectTitle: '3SCIH',
      rollMarked: true,
      allDay: false,
      start: '2022-05-17T22:45:00Z',
      finish: '2022-05-17T23:20:00Z',
      longTitle: '10:45: 1 - 3SCIH - B33 - JHD',
      longTitleWithoutTime: '1 - 3SCIH - B33 - JHD',
      period: 1,
      managers: [
        {
          managerUserID: 123456,
          managerIdentifier: 'JHD'
        }
      ],
      locations: [
        {
          locationID: 123456,
          locationName: 'B33'
        }
      ]
    },
    ...
  ]
  ```
</details>

## Endpoint Status
| Endpoint                                             | Implementation | Tests | Description                                           |
|------------------------------------------------------|----------------|-------|-------------------------------------------------------|
| GetCalendarEvents                                    | 🟢              | 🟡     | Timetable data                                        |
| GetUserDetails                                       | 🟢              | 🟡     | Detailed user data                                    |
| GetAllLocations                                      | 🟢              | 🟡     | List of all locations                                 |
| GetAllYearLevels                                     | 🟢              | 🟡     | List of all year levels                               |
| GetAllTerms                                          | 🟢              | 🟡     | List of school defined terms with dates               |
| GetFeedOptions                                       | 🔴              | 🔴     | School news feed data                                 |
| GetAllStaff                                          | 🔴              | 🔴     | List of all staff                                     |
| GetGroupActiviesList (they spelled Activities wrong) | 🔴              | 🔴     | List of all possible group activities e.g. detentions |
| GetAllCampuses                                       | 🔴              | 🔴     | List of all school campuses                           |

🟢 = Done
🟡 = Partially done (and passing)
🔴 = Not done

## Documentation
Coming soon.

## How does this work?

Compass unfortunately patched the original method of directly using endpoints to fetch data (now they use Cloudflare and it seems that every route is proxied). As a result, version 1 was sunsetted.

2.0.0+ now uses Puppeteer to bypass Cloudflare. This is way slower (10 seconds) but it is only slow for the initial login. The subsequent endpoint requests are much faster as we use the session cookies to make direct requests. If anyone has a better solution without needing browser emulation, please let me know.

## Contributing

Issues and pull	requests are welcome!

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information. We would love it if you could contribute to this project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.