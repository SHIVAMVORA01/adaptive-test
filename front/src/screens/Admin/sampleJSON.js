export const quesData = {
  data: {
    Aptitude: {
      easy: [
        {
          ques: "A bus running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
          id: 10,
          imgId:
            "http://res.cloudinary.com/chaitanya1911/image/upload/v1644996723/adaptive_test/Aptitude/czqbkowqrlpoo7nciyin.png",
          options: [
            {
              id: 829,
              title: "150",
              marks: 0,
              question: 10,
            },
            {
              id: 830,
              title: "399",
              marks: 0,
              question: 10,
            },
            {
              id: 831,
              title: "180",
              marks: 0,
              question: 10,
            },
            {
              id: 832,
              title: "150 (C)",
              marks: 1,
              question: 10,
            },
          ],
        },
      ],
      medium: [
        {
          ques: "A train can travel 50% faster than a car. Both start from point A at the same time and reach point B 75 kms away from A at the same time. On the way, however, the train lost about 12.5 minutes while stopping at the stations. The speed of the car is:\n",
          id: 17,
          imgId: null,
          options: [
            {
              id: 833,
              title: "A.\t100 kmph ",
              marks: 0,
              question: 17,
            },
            {
              id: 834,
              title: "B.\t110 kmph",
              marks: 0,
              question: 17,
            },
            {
              id: 835,
              title: " C.\t120 kmph (C)",
              marks: 2,
              question: 17,
            },
            {
              id: 836,
              title: "D.\t130 kmph",
              marks: 0,
              question: 17,
            },
          ],
        },
      ],
      hard: [],
      qs: 1,
      time: "00:00:20",
    },
    "Computer Fundamentals": {
      easy: [],
      medium: [
        {
          ques: "What do we call a collection of two or more computers that are located within a limited distance of each other and that are connected to each other directly or indirectly?",
          id: 8,
          imgId: null,
          options: [
            {
              id: 256,
              title: "(A) Internet",
              marks: 0,
              question: 8,
            },
            {
              id: 257,
              title: "(B) Intranet",
              marks: 0,
              question: 8,
            },
            {
              id: 258,
              title: "(C) Local Area Network (c)",
              marks: 2,
              question: 8,
            },
            {
              id: 259,
              title: " (D) Wide Area Network",
              marks: 0,
              question: 8,
            },
          ],
        },
      ],
      hard: [],
      qs: 1,
      time: "00:00:20",
    },
    Domain: {
      easy: [],
      medium: [
        {
          ques: "What is the output of the following code ?",
          id: 36,
          imgId:
            "http://res.cloudinary.com/chaitanya1911/image/upload/v1644955223/adaptive_test/Domain/vhm7p0pcdulfdpws94ci.jpg",
          options: [
            {
              id: 817,
              title: "10 (C)",
              marks: 2,
              question: 36,
            },
            {
              id: 818,
              title: "Infinite",
              marks: 0,
              question: 36,
            },
            {
              id: 819,
              title: "11",
              marks: 0,
              question: 36,
            },
            {
              id: 820,
              title: "5",
              marks: 0,
              question: 36,
            },
          ],
        },
      ],
      hard: [],
      qs: 1,
      time: "00:00:20",
    },
    Personality: {
      easy: [],
      medium: [
        {
          ques: "Enjoy wild flights of fantasy.",
          id: 73,
          imgId: null,
          options: [],
        },
      ],
      hard: [],
      qs: 35,
      time: "00:00:20",
    },
    "Analytical Writing": {
      easy: [],
      medium: [
        {
          title: "Unsinkable Ship",
          paraId: 1,
          para: "Naval architects never claim that a ship is unsinkable, but the sinking of the passenger-and-car ferry Estonia in the Baltic surely should have never have happened. It was well designed and carefully maintained. It carried the proper number of lifeboats. It had been thoroughly inspected the day of its fatal voyage. Yet hours later, the Estonia rolled over and sank in a cold, stormy night. It went down so quickly that most of those on board, caught in their dark, flooding cabins, had no chance to save themselves: Of those who managed to scramble overboard, only 139 survived. The rest died of hypothermia before the rescuers could pluck them from the cold sea. The final death toll amounted to 912 souls. However, there were an unpleasant number of questions about why the Estonia sank and why so many survivors were men in the prime of life, while most of the dead were women, children and the elderly.",
          questions: [
            {
              question: "One can understand from the reading that ",
              paraQsId: 52,
              options: [
                {
                  id: 64,
                  title:
                    "most victims were trapped inside the boat as they were in their cabins",
                  marks: 10,
                  paraqs: 52,
                },
              ],
            },
            {
              question: "New Question",
              paraQsId: 53,
              options: [
                {
                  id: 65,
                  title: "New Opt",
                  marks: 10,
                  paraqs: 53,
                },
              ],
            },
          ],
        },
      ],
      hard: [],
      qs: 3,
      time: "00:00:20",
    },
    Coding: {
      easy: [
        {
          id: 1,
          question:
            "Chef is a big fan of Coldplay. Every Sunday, he will drive to a park taking M minutes to reach there, and during the ride he will play a single song on a loop. Today, he has got the latest song which is in total S minutes long. He is interested to know how many times will he be able to play the song completely.",
          marks: 10,
          type: 1,
          input_format:
            "The first line contains an integer T - the number of test cases. Then the test cases follow.\nThe only line of each test case contains two space-separated integers M,S - the duration of the trip and the duration of the song, both in minutes.",
          output_format:
            "For each test case, output in a single line the answer to the problem.",
          constraints:
            "1\u2264T\u22641000 \n1\u2264M\u2264100\n1\u2264S\u226410",
          sample_input: ["3\n10 5\n10 6\n9 10"],
          sample_output: ["2\n1\n0"],
          explanation:
            "Chef listens to the song once from 0\u22125 minutes and next from 5\u221210 minutes.\nChef listens to the song from 0\u22126 minutes but now he has only 4 minutes left so he can't complete the song again.\nSince the song lasts longer than the journey, Chef won't be able to complete it even once.",
          test_case_input: [
            "3\n10 5\n10 6\n9 10",
            "5\n14 6\n10 7\n3 1\n4 6\n100 10",
            "2\n3 4\n10 3",
          ],
          test_case_output: ["2\n1\n0", "2\n1\n0", "0\n3"],
        },
      ],
      medium: [
        {
          id: 2,
          question:
            "Everyone knows about Ram's love for food and cooking but little is known about his love for racing sports. He is an avid Formula 1 fan. He went to watch this year's Indian Grand Prix at New Delhi. He noticed that one segment of the circuit was a long straight road. It was impossible for a car to overtake other cars on this segment. Therefore, a car had to lower down its speed if there was a slower car in front of it. While watching the race, Ram started to wonder how many cars were moving at their maximum speed.\r\n\r\nFormally, you're given the maximum speed of N cars in the order they entered the long straight segment of the circuit. Each car prefers to move at its maximum speed. If that's not possible because of the front car being slow, it might have to lower its speed. It still moves at the fastest possible speed while avoiding any collisions. For the purpose of this problem, you can assume that the straight segment is infinitely long.\r\n\r\nCount the number of cars which were moving at their maximum speed on the straight segment.",
          marks: 20,
          type: 2,
          input_format:
            "The first line of the input contains a single integer T denoting the number of test cases to follow. Description of each test case contains 2 lines. The first of these lines contain a single integer N, the number of cars. The second line contains N space separated integers, denoting the maximum speed of the cars in the order they entered the long straight segment.",
          output_format:
            "For each test case, output a single line containing the number of cars which were moving at their maximum speed on the segment.",
          constraints:
            "1 \u2264 T \u2264 100\r\n1 \u2264 N \u2264 10,000\r\nAll speeds are distinct positive integers that fit in a 32 bit signed integer.\r\nEach input file will not be larger than 4 MB (4,000,000,000 bytes) in size.\r\n\r\nWARNING! The input files are very large. Use faster I/O.",
          sample_input: ["3\n1\n10\n3\n8 3 6\n5\n4 5 1 2 3"],
          sample_output: ["1\n2\n2"],
          explanation: null,
          test_case_input: [
            "3\n1\n10\n3\n8 3 6\n5\n4 5 1 2 3",
            "2\n5\n7 2 8 3 6\n3\n88 6 5",
            "2\n5\n1 2 8 3 6\n3\n4 6 5",
          ],
          test_case_output: ["1\n2\n2", "2\n3", "1\n1"],
        },
      ],
      hard: [
        {
          id: 8,
          question: "what is A+b??",
          marks: 30,
          type: 3,
          input_format: "int a,int b",
          output_format: "int a+b",
          constraints: "0<a<b",
          sample_input: ["1\n2"],
          sample_output: ["3"],
          explanation: "",
          test_case_input: ["2\n3", "3\n4", "4\n5"],
          test_case_output: ["5", "7", "9"],
        },
      ],
      qs: 3,
      time: "00:00:20",
    },
  },
};
