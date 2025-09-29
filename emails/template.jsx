import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Text,
} from '@react-email/components';

// Dummy data for preview
const PREVIEW_DATA = {
  monthlyReport: {
    userName: 'John Doe',
    type: 'monthly-report',
    data: {
      month: 'December',
      stats: {
        totalIncome: 5000,
        totalExpenses: 3500,
        byCategory: {
          housing: 1500,
          groceries: 600,
          transportation: 400,
          entertainment: 300,
          utilities: 700,
        },
        transactionCount: 10,
      },
      insights: [
        'Your housing expenses are 43% of your total spending - consider reviewing your housing costs.',
        'Great job keeping entertainment expenses under control this month!',
        'Setting up automatic savings could help you save 20% more of your income.',
      ],
    },
  },
  budgetAlert: {
    userName: 'John Doe',
    type: 'budget-alert',
    data: {
      percentageUsed: 85,
      budgetAmount: 4000,
      totalExpenses: 3400,
    },
  },
};

export default function EmailTemplate({
  userName = '',
  type = 'monthly-report',
  data = {},
  // data = {},
}) {
  console.log(userName, type);
  return (
    <Html>
      {type === 'budget-alert' ? (
        <div>
          <Head />
          <Preview>{`Budget Alert`}</Preview>
          <Body style={styles.body}>
            <Container style={styles.container}>
              <Heading style={styles.title}>Budget Alert</Heading>
              <Text style={styles.greeting}>Hello {userName},</Text>
              <Text style={styles.message}>
                You've used <strong>{data?.percentageUsed?.toFixed(2)}%</strong>
                of your monthly budget. Keep an eye on your spending to stay
                within limits.
              </Text>

              <Row>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Budget</Text>
                  <Text style={styles.statValue}>₹{data?.budgetAmount}</Text>
                </Column>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Spent so far</Text>
                  <Text style={styles.statValue}>₹{data?.totalExpenses}</Text>
                </Column>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Remaining</Text>
                  <Text style={styles.statValue}>
                    ₹{data?.budgetAmount - data?.totalExpenses}
                  </Text>
                </Column>
              </Row>
            </Container>
          </Body>
        </div>
      ) : (
        <div>
          <Head />
          <Preview>{`Monthly Financial Insights`}</Preview>
          <Body style={styles.body}>
            <Container style={styles.container}>
              <Heading style={styles.title}>
                {data?.month} Financial Insights
              </Heading>
              <Text style={styles.greeting}>Hello {userName},</Text>
              <Text style={styles.message}>
                Here’s a quick summary of your transactions this month.
              </Text>

              <Row>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Total Income</Text>
                  <Text style={styles.statValue}>
                    ₹{Number(data?.stats?.totalIncome)?.toFixed(2)}
                  </Text>
                </Column>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Total Expense</Text>
                  <Text style={styles.statValue}>
                    ₹{Number(data?.stats?.totalExpenses)?.toFixed(2)}
                  </Text>
                </Column>
                <Column align="center" className="h-[40px]">
                  <Text style={styles.statTitle}>Transactions</Text>
                  <Text style={styles.statValue}>
                    {data?.stats?.transactionCount}
                  </Text>
                </Column>
              </Row>

              <div style={{ ...styles.card, marginTop: '20px' }}>
                <Heading
                  as="h3"
                  style={{
                    ...styles.title,
                    fontSize: '16px',
                    marginBottom: '12px',
                  }}
                >
                  Expenses by Category
                </Heading>
                <table style={styles.table}>
                  <tbody>
                    {data?.stats?.byCategory &&
                      Object.entries(data?.stats?.byCategory).map(
                        ([category, amount]) => (
                          <tr key={category} style={styles.tableRow}>
                            <td style={styles.tableCell}>{category}</td>
                            <td
                              style={{
                                ...styles.tableCell,
                                textAlign: 'right',
                                color: '#059669',
                              }}
                            >
                              ₹{Number(amount)?.toFixed(2)}
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>

              {/* SECTION 3: Insights */}
              {data?.insights && (
                <div style={{ ...styles.card, marginTop: '20px' }}>
                  <Heading
                    as="h3"
                    style={{
                      ...styles.title,
                      fontSize: '16px',
                      marginBottom: '12px',
                    }}
                  >
                    Insights
                  </Heading>
                  {data?.insights?.map((insight, index) => (
                    <Text key={index} style={styles.message}>
                      • {insight}
                    </Text>
                  ))}
                </div>
              )}

              <Text style={{ marginTop: '20px' }}>
                Thank you for using Budgeteer! Keep tracking your spending to
                make the most of your money 🚀
              </Text>
            </Container>
          </Body>
        </div>
      )}
    </Html>
  );
}

const styles = {
  body: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#12171f',
    color: '#e5e7eb',
  },
  container: {
    borderRadius: '16px',
    padding: '10px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'left',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    textAlign: 'center',
    color: '#059669',
  },
  greeting: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    color: '#d1d5db',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  statBox: {
    padding: '10px',
  },
  statTitle: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#10b981',
  },
  card: {
    backgroundColor: '#ffffff14',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    fontSize: '14px',
    padding: '8px 0',
    borderBottom: '1px solid #e5e5e5',
  },
};
