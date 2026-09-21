import json

with open('src/data/curriculum.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Title:', data['title'])
print('Total modules:', len(data['modules']))
v1_mods = [m for m in data['modules'] if m['volume'] == 1]
v2_mods = [m for m in data['modules'] if m['volume'] == 2]
print(f'Volume 1 modules: {len(v1_mods)}')
print(f'Volume 2 modules: {len(v2_mods)}')

total_cmds = sum(len(m['ciscoCommands']) for m in data['modules'])
total_quizzes = sum(len(m['quiz']) for m in data['modules'])
total_diagrams = sum(len(m['diagrams']) for m in data['modules'])
print(f'Total Cisco CLI Commands: {total_cmds}')
print(f'Total Chapter Quiz Questions: {total_quizzes}')
print(f'Total Diagrams Linked: {total_diagrams}')

# Check first module and random middle module
print('\nSample Module 1:')
m1 = data['modules'][0]
print('  ID:', m1['id'])
print('  Title:', m1['title'])
print('  Quiz count:', len(m1['quiz']))
print('  Commands count:', len(m1['ciscoCommands']))
print('  Lab scenario:', m1['labMission']['scenario'])

print('\nSample Module 25 (Vol 2 Ch 1):')
m25 = data['modules'][24]
print('  ID:', m25['id'])
print('  Title:', m25['title'])
print('  Quiz count:', len(m25['quiz']))
print('  Commands count:', len(m25['ciscoCommands']))

# Check if Chapter 2 (Volume 1) has questions
m2 = data['modules'][1] # Ch 2
print('\nSample Module 2 (Vol 1 Ch 2 Network Devices):')
print('  ID:', m2['id'])
print('  Title:', m2['title'])
print('  Quiz count:', len(m2['quiz']))
if m2['quiz']:
    print('  Q1 Question:', m2['quiz'][0]['question'])
    print('  Q1 Options:', m2['quiz'][0]['options'])
    print('  Q1 Official Answer:', m2['quiz'][0]['officialAnswer'])
    print('  Q1 Explanation:', m2['quiz'][0]['explanation'])
